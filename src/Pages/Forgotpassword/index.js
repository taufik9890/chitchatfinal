import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import "./style.css";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";

const Forgot = () => {
  const auth = getAuth();

  const restPassword = () => {
    sendPasswordResetEmail(auth, formik.values.email)
      .then(() => {
        toast.success("mail sent");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: () => {
      restPassword();
    },
  });

  return (
    <>
      <div className="main-forgot-wrapper">
        <ToastContainer />
        <div className="inner-forgot-box">
          <div className="forgot-header">
            <h4>Reset Your Password</h4>
          </div>
          <div className="forgot-body">
            <form onClick={formik.handleSubmit}>
              <TextField
                className="inputs"
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <div className="forgot-btn">
                <Button type="submit" variant="contained">
                  reset
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
