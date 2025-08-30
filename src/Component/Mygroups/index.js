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
import Alert from "@mui/material/Alert";

const Mygroups = () => {
  const [mygrpList, setMygrpList] = useState([]);
  const [grpReqList, setGrpReqList] = useState([]);
  const [show, setShow] = useState(false);
  const [member, setMember] = useState(false);
  const [grpMember, setGrpMember] = useState([]);
  const db = getDatabase();
  const user = useSelector((users) => users.loginSlice.login);

  useEffect(() => {
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      let groupArr = [];
      snapshot.forEach((item) => {
        if (user.uid === item.val().adminid) {
          groupArr.push({ ...item.val(), id: item.key });
        }
      });
      setMygrpList(groupArr);
    });
  }, []);

  // Show info
  const handleMemberShow = (grpmember) => {
    setMember(true);
    const starCountRef = ref(db, "groupmembers");
    onValue(starCountRef, (snapshot) => {
      let memberArr = [];
      snapshot.forEach((item) => {
        if (
          user.uid === grpmember.adminid &&
          grpmember.id === item.val().groupid
        ) {
          memberArr.push({ ...item.val(), id: item.key });
        }
      });
      setGrpMember(memberArr);
    });
  };

  // Send Group Request
  const handleReqShow = (gitem) => {
    setShow(true);
    const starCountRef = ref(db, "groupjoinrequest");
    onValue(starCountRef, (snapshot) => {
      let groupreqArr = [];
      snapshot.forEach((item) => {
        if (
          user.uid === item.val().adminid &&
          item.val().groupid === gitem.id
        ) {
          groupreqArr.push({ ...item.val(), id: item.key });
        }
      });
      setGrpReqList(groupreqArr);
    });
  };

  // Accept Group request
  const handleAccept = (item) => {
    set(push(ref(db, "groupmembers")), {
      adminid: item.adminid,
      userid: item.userid,
      groupid: item.groupid,
      adminname: item.adminname,
      username: item.username,
      groupname: item.groupname,
    }).then(() => {
      remove(ref(db, "groupjoinrequest/" + item.id));
    });
  };

  // Reject Group request
  const handleReject = (item) => {
    remove(ref(db, "groupjoinrequest/" + item.id));
  };

  // Remove Group member
  const handleRemove = (item) => {
    remove(ref(db, "groupmembers/" + item.id));
  };

  return (
    <>
      <div className="mygroups">
        <div className="mygroups-header">
          <h4>My Groups</h4>
        </div>
        {show && (
          <button
            className="goback-button"
            type="button"
            onClick={() => setShow(false)}
          >
            Go Back
          </button>
        )}
        {member && (
          <button
            className="goback-button"
            type="button"
            onClick={() => setMember(false)}
          >
            Go Back
          </button>
        )}
        {mygrpList.length === 0 ? (
          <Alert severity="error">No groups created yet</Alert>
        ) : show ? (
          grpReqList.length === 0 ? (
            <Alert severity="error">No request found</Alert>
          ) : (
            grpReqList.map((item, i) => (
              <div className="mygrp-wrapper" key={i}>
                <div className="mygrp-image">
                  <picture>

                  <img src="./media/images/pro_pic.png" alt="pro_pic" />
                  </picture>
                </div>
                <div className="mygrp-name">
                  <h4>{item.username}</h4>
                </div>
                <div className="mygrp-btn">
                  <button type="button" onClick={() => handleAccept(item)}>
                    Accept
                  </button>
                  <button type="button" onClick={() => handleReject(item)}>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )
        ) : member ? (
          grpMember.map((item, i) => (
            <div className="wrapper">
              <p>
                Total{" "}
                {grpMember.length === 1 || grpMember.length === 0
                  ? "Member"
                  : "Members"}{" "}
                : {grpMember.length}
              </p>
              <div className="mygrp-wrapper" key={i}>
                <div className="mygrp-image">
                  <picture>

                  <img src="./media/images/grouplist1.png" alt="pro_pic" />
                  </picture>
                </div>
                <div className="mygrp-name">
                  <h4>{item.username}</h4>
                </div>
                <div className="mygrp-btn">
                  <button type="button" onClick={() => handleRemove(item)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          mygrpList.map((item, i) => (
            <div className="mygrp-wrapper" key={i}>
              <div className="mygrp-image">
                <picture>
                  <img src="./media/images/grouplist1.png" alt="pro_pic" />
                  </picture>
              </div>
              <div className="mygrp-name">
                <span>Admin: {item.admin}</span>
                <h4>{item.groupname}</h4>
                <span>{item.grouptag}</span>
              </div>

              <div className="mygrp-btn">
                <button
                  className="info-btn"
                  type="button"
                  onClick={() => handleMemberShow(item)}
                >
                  Info
                </button>
                <button type="button" onClick={() => handleReqShow(item)}>
                  Request
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Mygroups;
