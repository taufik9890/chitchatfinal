import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { BsGear } from "react-icons/bs";
import "./style.css";
import { NavLink } from "react-router-dom";

const Sidebaricons = () => {
  return (
    <div className="icons">
      <NavLink className="sidebar-icons" to="/">
        <AiOutlineHome />
      </NavLink>
      <NavLink className="sidebar-icons" to="/message">
        <FaComment />
      </NavLink>
      <NavLink className="sidebar-icons" to="/notifications">
        <IoMdNotifications />
      </NavLink>
      <NavLink className="sidebar-icons" to="/settings">
        <BsGear />
      </NavLink>
    </div>
  );
};

export default Sidebaricons;
