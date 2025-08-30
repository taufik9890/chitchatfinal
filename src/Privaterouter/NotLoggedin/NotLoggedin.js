import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function NotLoggedin() {
  const user = useSelector((users) => users.loginSlice.login);
  return user ? <Navigate to="/" /> : <Outlet />;
}
