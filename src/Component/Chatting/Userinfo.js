import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";

const Userinfo = () => {
  const activeChatName = useSelector((state) => state.activeChat.active);

  return (
    <>
      <div className="active-user-status">
        <div className="user-img">
          <div className="image"></div>
          <div className="info">
            <h4>{activeChatName?.name}</h4>
            <span>Online</span>
          </div>
        </div>
        <div className="info-bar">
          <BsThreeDotsVertical size={27} />
        </div>
      </div>
    </>
  );
};

export default Userinfo;
