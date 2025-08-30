import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Loggedin from "./Privaterouter/Loggedin/Loggedin";
import NotLoggedin from "./Privaterouter/NotLoggedin/NotLoggedin";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import Forgot from "./Pages/Forgotpassword";
import RootLayout from "./Layout";
import Message from "./Pages/Message";
import Settings from "./Pages/Settings";
import Notifications from "./Pages/Notifications";
import { useSelector } from "react-redux";

function App() {
  const theme = useSelector((state) => state.themeChange.DarkMode);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<Loggedin />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/message" element={<Message />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/notifications" element={<Notifications />}></Route>
          </Route>
        </Route>
        <Route element={<NotLoggedin />}>
          <Route path="/registration" element={<Registration />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgot" element={<Forgot />}></Route>
        </Route>
      </Route>
    )
  );
  return (
    <>
      <div className={theme && "dark"}>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
