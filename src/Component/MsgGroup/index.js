import React, { useEffect, useState } from "react";
import "./style.css";
import { getDatabase, onValue, ref } from "firebase/database";
import { useDispatch } from "react-redux";
import { activeChat } from "../../features/Slice/activeChatSlice";

const MsgGroup = () => {
  const [msgGrp, setMsgGrp] = useState([]);
  const db = getDatabase();
  const dispatch = useDispatch();

  // Render group data
  useEffect(() => {
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      let msgGrpArr = [];
      snapshot.forEach((item) => {
        msgGrpArr.push({ ...item.val(), id: item.key });
      });
      setMsgGrp(msgGrpArr);
    });
  }, []);

  // Group msg
  const handleActiveGroup = (item) => {
    dispatch(
      activeChat({
        status: "group",
        id: item.id,
        name: item.groupname,
        adminid: item.adminid,
        admin: item.admin,
      })
    );
  };

  return (
    <>
      <div className="msggrp">
        <div className="msggrp-header">
          <h4>all groups</h4>
        </div>
        {msgGrp.map((item, i) => (
          <div
            className="msggrp-wrapper"
            key={i}
            onClick={() => handleActiveGroup(item)}
          >
            <div className="msggrp-image">
              <picture>
                  <img src="./media/images/grouplist1.png" alt="pro_pic" />
                  </picture>
            </div>
            <div className="msggrp-name">
              <h4>{item.groupname}</h4>
              <p>{item.grouptag}</p>
            </div>
            {/* <div className="msggrp-btn">
              <button type="button">Reject</button>
            </div> */}
          </div>
        ))}
      </div>
    </>
  );
};

export default MsgGroup;
