import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style.css";
// import '../../../public/media/images/pro_pic.png'

const Friendrequest = () => {
  const [frndreq, setFrndreq] = useState([]);
  const user = useSelector((users) => users.loginSlice.login);
  const db = getDatabase();

  // show friend request
  useEffect(() => {
    const starCountRef = ref(db, "friendrequest/");
    onValue(starCountRef, (snapshot) => {
      let reqArr = [];
      snapshot.forEach((item) => {
        if (item.val().receiverid === user.uid) {
          reqArr.push({ ...item.val(), id: item.key });
        }
      });
      setFrndreq(reqArr);
    });
  }, []);

  // friend request accept
  const handleAccept = (data) => {
    set(push(ref(db, "friends")), {
      ...data,
    }).then(() => {
      remove(ref(db, "friendrequest/" + data.id));
    });
  };
  return (
    <>
      <div className="friendrequest">
        <div className="friendrequest-header">
          <h4>Friend request</h4>
        </div>
        {frndreq.map((item, i) => (
          <div className="friendreqest-wrapper" key={i}>
            <div className="friendreq-images">
              <picture>
                <img src="./media/images/pro_pic.png" alt="pro_pic" />
              </picture>
            </div>
            <div className="friendreq-name">
              <h4>{item.sendername}</h4>
            </div>
            <div className="friendrequest-btn">
              <button type="button" onClick={() => handleAccept(item)}>
                Accept
              </button>
              <button type="button">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Friendrequest;
