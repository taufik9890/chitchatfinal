import React, { useEffect, useState } from "react";
import "./style.css";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
// import propic from ''

const Friends = () => {
  const [frnds, setFrnds] = useState([]);
  const db = getDatabase();
  const user = useSelector((users) => users.loginSlice.login);

  useEffect(() => {
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      let frndArr = [];
      snapshot.forEach((item) => {
        if (
          user.uid === item.val().receiverid ||
          user.uid === item.val().senderid
        ) {
          frndArr.push({ ...item.val(), id: item.key });
        }
      });
      setFrnds(frndArr);
    });
  }, []);

  // unfriend
  const handleUnfrnd = (data) => {
    remove(ref(db, "friends/" + data.id));
  };

  // block friend
  const handleBlock = (item) => {
    if (user.uid === item.senderid) {
      set(push(ref(db, "block")), {
        block: item.receivername,
        blockid: item.receiverid,
        blockedby: item.sendername,
        blockedid: item.senderid,
      }).then(() => {
        remove(ref(db, "friends/" + item.id));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.sendername,
        blockid: item.senderid,
        blockedby: item.receivername,
        blockedid: item.receiverid,
      }).then(() => {
        remove(ref(db, "friends/" + item.id));
      });
    }
  };
  return (
    <>
      <div className="friends">
        <div className="friends-header">
          <h4>Friends</h4>
        </div>

        {frnds.map((item, i) => (
          <div className="friends-wrapper" key={i}>
            <div className="friends-image">
              <img src="./media/images/pro_pic.png" alt="" />
            </div>
            
            <div className="friends-name">
              <h4>
                {user.uid === item.senderid
                  ? item.receivername
                  : item.sendername}
              </h4>
            </div>
            <div className="friends-btn">
              <button
                className="unfriend-btn"
                type="button"
                onClick={() => handleUnfrnd(item)}
              >
                Unfriend
              </button>
              <button
                className="block-btn"
                type="button"
                onClick={() => handleBlock(item)}
              >
                Block
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Friends;
