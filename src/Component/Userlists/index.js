import React, { useEffect, useState } from "react";
import "./style.css";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import { BsSearch } from "react-icons/bs";

const Userlist = () => {
  const [userlist, setUserlist] = useState([]);
  const [frndreq, setFrndreq] = useState([]);
  const [frndlist, setFrndlist] = useState([]);
  const [filteruser, setFilteruser] = useState([]);
  const user = useSelector((users) => users.loginSlice.login);
  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "users");
    onValue(starCountRef, (snapshot) => {
      const userArr = [];
      snapshot.forEach((userlist) => {
        if (user.uid !== userlist.key) {
          userArr.push({ ...userlist.val(), id: userlist.key });
        }
      });
      setUserlist(userArr);
    });
  }, []);

  // show friend list
  useEffect(() => {
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      let frndArr = [];
      snapshot.forEach((item) => {
        frndArr.push(item.val().receiverid + item.val().senderid);
      });
      setFrndlist(frndArr);
    });
  }, []);

  // sent request
  const handleSentRequest = (item) => {
    set(push(ref(db, "friendrequest")), {
      sendername: user.displayName,
      senderid: user.uid,
      receivername: item.username,
      receiverid: item.id,
    });
  };

  // show friend request
  useEffect(() => {
    const starCountRef = ref(db, "friendrequest");
    onValue(starCountRef, (snapshot) => {
      let reqArr = [];
      snapshot.forEach((item) => {
        reqArr.push(item.val().receiverid + item.val().senderid);
      });
      setFrndreq(reqArr);
    });
  }, []);

  // Search User list
  const handleSearch = (e) => {
    let arr = [];
    if (e.target.value.length === 0) {
      setFilteruser([]);
    }
    userlist.filter((item) => {
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        arr.push(item);
        // console.log(item);
      }
      setFilteruser(arr);
    });
  };

  console.log(filteruser);
  return (
    <>
      <div className="userlist">
        <div className="userlist-header">
          <h4>User List</h4>
        </div>
        {/* -------------------------------------Search Box Start------------------------------- */}

        <div className="search-wrapper">
          <div className="search-icons">
            <BsSearch />
          </div>
          <div className="search-field">
            <input
              onChange={handleSearch}
              type="text"
              placeholder="Search here..."
            />
          </div>
        </div>
        {/* -------------------------------------Search Box End------------------------------- */}

        {filteruser.length > 0
          ? filteruser.map((item, i) => (
              <div className="userlist-wrapper" key={i}>
                <div className="userlist-image">
                  <picture>

                  <img src="./media/images/pro_pic.png" alt="pro_pic" />
                  </picture>
                </div>
                <div className="userlist-name">
                  <h4>{item.username}</h4>
                </div>

                {/* Block dekhate hobe if anyone blocked someone. */}
                <div className="userlist-btn">
                  {frndlist.includes(item.id + user.uid) ||
                  frndlist.includes(user.uid + item.id) ? (
                    <button type="button">Friend</button>
                  ) : frndreq.includes(item.id + user.uid) ||
                    frndreq.includes(user.uid + item.id) ? (
                    <button type="button">Cancel</button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSentRequest(item)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))
          : userlist.map((item, i) => (
              <div className="userlist-wrapper" key={i}>
                <div className="userlist-image">
                  <picture>

                  <img src="./media/images/pro_pic.png" alt="pro_pic" />
                  </picture>
                </div>
                <div className="userlist-name">
                  <h4>{item.username}</h4>
                </div>
 
                {/* Block dekhate hobe if anyone blocked someone. */}
                <div className="userlist-btn">
                  {frndlist.includes(item.id + user.uid) ||
                  frndlist.includes(user.uid + item.id) ? (
                    <button type="button">Friend</button>
                  ) : frndreq.includes(item.id + user.uid) ||
                    frndreq.includes(user.uid + item.id) ? (
                    <button type="button">Cancel</button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSentRequest(item)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default Userlist;
