import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { getAuth, updatePassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { Loginuser } from "../../features/Slice/UserSlice";
import { toast } from "react-toastify";

const Accountforms = () => {
  const user = useSelector((users) => users.loginSlice.login);
  const db = getDatabase();
  const auth = getAuth();
  const currentuser = auth.currentUser;
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: user.displayName,
      email: user.email,
      password: "",
    },
    onSubmit: () => {
      handleUpdateProfile();
    },
  });

  const handleUpdateProfile = async () => {
    await updateProfile(auth.currentUser, {
      displayName: formik.values.name,
    }).then(async () => {
      const userInfo = {
        displayName: auth.currentUser.displayName,
      };

      await update(ref(db, "users/", +user.uid), {
        username: userInfo.displayName,
      });

      await updatePassword(currentuser, formik.values.password).then(() => {
        toast.success("Password Updated");
      });

      dispatch(
        Loginuser({
          ...user,
          displayName: formik.values.name,
        })
      );
      localStorage.setItem(
        "users",
        JSON.stringify({
          ...user,
          displayName: formik.values.name,
        })
      );
    });
  };

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            className="inputs"
            label="Name"
            fullWidth
            type="text"
            name="name"
            variant="outlined"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <TextField
            className="inputs"
            label="Email"
            fullWidth
            type="email"
            name="Email"
            variant="outlined"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
            margin="normal"
            disabled
          />
          <TextField
            className="inputs"
            label="New Password"
            fullWidth
            type="password"
            name="password"
            variant="outlined"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
            margin="normal"
          />
          <Button
            variant="contained"
            type="submit"
            className="submit-btn"
            fullWidth
          >
            Update Account
          </Button>
        </form>
      </div>
    </>
  );
};

export default Accountforms;
