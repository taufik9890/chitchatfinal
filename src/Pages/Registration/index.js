import { Button, Container, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signUp } from "../../validation/Validation";
import { ToastContainer, toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
  const [passShow, setPassShow] = useState("password");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getDatabase();

  const handlePassword = () => {
    if (passShow === "password") {
      setPassShow("text");
    } else {
      setPassShow("password");
    }
  };

  const initialValues = {
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUp,
    onSubmit: () => {
      setLoading(true);
      createUserWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({ user }) => {
          updateProfile(auth.currentUser, {
            displayName: formik.values.fullname,
          }).then(() => {
            sendEmailVerification(auth.currentUser)
              .then(() => {
                set(ref(db, "users/" + user.uid), {
                  username: user.displayName,
                  email: user.email,
                }).then(() => {
                  toast.success("Please Verify Your Email !", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: "light",
                    progress: undefined,
                    draggable: true,
                  });
                });
              })
              .then(() => {
                formik.resetForm();
                setLoading(false);
                navigate("/login");
              });
          });
        })
        .catch((error) => {
          if (error.code.includes("auth/email-already-in-use")) {
            toast.error("Email already in used", {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: true,
              pauseOnHover: false,
            });
            setLoading(false);
          }
        });
    },
  });
  return (
    <div className="main_box registration">
      <Container fixed>
        <ToastContainer />
        <Grid className="box" container spacing={2}>
          <Grid item xs={6}>
            <div className="registration-left">
              <h3>Get started with easily register</h3>
              <span>Free register and you can enjoy it</span>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  className="inputs"
                  label="Full Name"
                  variant="outlined"
                  type="text"
                  onChange={formik.handleChange}
                  name="fullname"
                  value={formik.values.fullname}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      "& > fieldset": {
                        borderColor: "var(--border-color)",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "var(--black)",
                    },
                  }}
                />
                {formik.errors.fullname && formik.touched.fullname ? (
                  <p className="error-message">{formik.errors.fullname}</p>
                ) : null}
                <TextField
                  className="inputs"
                  label="Email"
                  variant="outlined"
                  type="email"
                  onChange={formik.handleChange}
                  name="email"
                  value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email ? (
                  <p className="error-message">{formik.errors.email}</p>
                ) : null}
                <div className="password-box">
                  <TextField
                    className="inputs"
                    label="Password"
                    variant="outlined"
                    type={passShow}
                    onChange={formik.handleChange}
                    name="password"
                    value={formik.values.password}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <p className="error-message">{formik.errors.password}</p>
                  ) : null}
                  <div className="eyes" onClick={handlePassword}>
                    {passShow === "password" ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </div>
                </div>
                <TextField
                  className="inputs"
                  label="Confirm Password"
                  variant="outlined"
                  type={passShow}
                  onChange={formik.handleChange}
                  name="confirmpassword"
                  value={formik.values.confirmpassword}
                />
                {formik.errors.confirmpassword &&
                formik.touched.confirmpassword ? (
                  <p className="error-message">
                    {formik.errors.confirmpassword}
                  </p>
                ) : null}
                {loading ? (
                  <Button
                    disabled
                    className="signup-btn"
                    type="submit"
                    variant="contained"
                  >
                    <BeatLoader className="loader" color="#fff" size={15} />
                  </Button>
                ) : (
                  <Button
                    className="signup-btn"
                    type="submit"
                    variant="contained"
                  >
                    sign up
                  </Button>
                )}
              </form>
              <div className="account">
                <p>
                  Already have an account ? <Link to="/login">Sign In</Link>
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div>
              <picture>
                <img
                  className="register_pic"
                  src="./media/images/register.png"
                  alt="Register"
                />
              </picture>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Registration;
