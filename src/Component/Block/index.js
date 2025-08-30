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

const Blocklist = () => {
  const [block, setBlock] = useState([]);
  const user = useSelector((users) => users.loginSlice.login);
  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "block");
    onValue(starCountRef, (snapshot) => {
      let blockArr = [];
      snapshot.forEach((item) => {
        if (item.val().blockedid === user.uid) {
          blockArr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
          });
        } else {
          blockArr.push({
            id: item.key,
            blockedby: item.val().blockedby,
            blockedid: item.val().blockedid,
          });
        }
        // blockArr.push({ ...item.val(), id: item.key });
      });
      setBlock(blockArr);
    });
  }, []);

  // Unblock
  const handleUnblock = (item) => {
    set(push(ref(db, "friends")), {
      sendername: item.block,
      senderid: item.blockid,
      receivername: user.displayName,
      receiverid: user.uid,
    }).then(() => {
      remove(ref(db, "block/" + item.id));
    });
  };
  return (
    <>
      <div className="blocklist">
        <div className="blocklist-header">
          <h4>Blocked List</h4>
        </div>
        {block.map((item, i) => (
          <div className="blocked-wrapper" key={i}>
            <div className="blocked-image">
              <img src="./media/images/pro_pic.png" alt="pro_pic" />
            </div>
            <div className="blocked-name">
              <h4>{item.block}</h4>
              <h4>{item.blockedby}</h4>
            </div>
            {!item.blockedid && (
              <div className="blocked-btn">
                <button type="button" onClick={() => handleUnblock(item)}>
                  Unblock
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Blocklist;
