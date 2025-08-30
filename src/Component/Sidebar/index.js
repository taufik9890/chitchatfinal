import React from "react";
import Sidebaricons from "./Sidebaricons";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { Loginuser } from "../../features/Slice/UserSlice";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Popup from "../Modal";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const users = useSelector((user) => user.loginSlice.login);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("users");
        dispatch(Loginuser(null));
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-wrapper">
          <div>
            <div className="profile-picture" onClick={handleOpen}>
              <picture>
                <img src={users.photoURL} alt="Profile Pic" />
              </picture>
              <div className="profile-overlay">
                <AiOutlineCloudUpload />
              </div>
            </div>
            <div className="username">
              <h4>{users.displayName}</h4>
            </div>
          </div>

          <div className="pages">
            <Sidebaricons />
          </div>
          <div className="logout" onClick={handleLogout}>
            <BiLogOut />
          </div>
        </div>
      </div>
      <Popup open={open} setOpen={setOpen} />
    </>
  );
};

export default Sidebar;
