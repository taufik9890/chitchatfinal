import { Button, Container, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signIn } from "../../validation/Validation";
import { toast, ToastContainer } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loginuser } from "../../features/Slice/UserSlice";

const Login = () => {
  const [passShow, setPassShow] = useState("password");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const googleprovider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePassword = () => {
    if (passShow === "password") {
      setPassShow("text");
    } else {
      setPassShow("password");
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signIn,
    onSubmit: () => {
      setLoading(true);
      signInWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({ user }) => {
          if (auth.currentUser.emailVerified === true) {
            navigate("/");
            dispatch(Loginuser(user));
            localStorage.setItem("users", JSON.stringify(user));
          } else {
            toast.error("Please verify your email", {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: true,
              pauseOnHover: false,
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          if (error.code.includes("auth/user-not-found")) {
            toast.error("Invalid Email", {
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

  // google authentication
  const handleGoogleauth = () => {
    signInWithPopup(auth, googleprovider).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="main_box">
      <Container fixed>
        <ToastContainer />
        <Grid className="box" container spacing={2}>
          <Grid item xs={6}>
            <div>
              <picture>
                <img
                  className="register_pic"
                  src="./media/images/login.png"
                  alt="Register"
                />
              </picture>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="login-left">
              <div className="avatar">
                <picture>
                  <img src="./media/images/avatar.png" alt="avatar" />
                </picture>
              </div>
              <h3>sign-in your account</h3>
              <div className="social-login">
                <div className="authentication" onClick={handleGoogleauth}>
                  <div className="auth_pic">
                    <picture>
                      <img src="./media/images/google.png" alt="google" />
                    </picture>
                  </div>
                  <div className="auth_text">
                    <p>Google</p>
                  </div>
                </div>
                <div className="authentication" onClick={handleGoogleauth}>
                  <div className="auth_pic">
                    <picture>
                      <img src="./media/images/google.png" alt="google" />
                    </picture>
                  </div>
                  <div className="auth_text">
                    <p>Twitter</p>
                  </div>
                </div>
                <div className="authentication" onClick={handleGoogleauth}>
                  <div className="auth_pic">
                    <picture>
                      <img src="./media/images/google.png" alt="google" />
                    </picture>
                  </div>
                  <div className="auth_text">
                    <p>Github</p>
                  </div>
                </div>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  className="inputs"
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
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
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <p className="error-message">{formik.errors.password}</p>
                  ) : null}
                  <div className="login-eyes" onClick={handlePassword}>
                    {passShow === "password" ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </div>
                </div>

                {loading ? (
                  <Button
                    disabled
                    className="signin-btn"
                    type="submit"
                    variant="contained"
                  >
                    <BeatLoader className="loader" color="#fff" size={15} />
                  </Button>
                ) : (
                  <Button
                    className="signin-btn"
                    type="submit"
                    variant="contained"
                  >
                    sign in
                  </Button>
                )}
              </form>
              <div className="login-account">
                <Link to="/forgot">Forgot password?</Link>
                <p>
                  Don't have an account ?{" "}
                  <Link to="/registration">Sign Up</Link>
                </p>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
