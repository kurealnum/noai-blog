import { createBrowserRouter } from "react-router-dom";
import Login from "../containers/Login";
import AuthenticatedRoute from "./AuthenticatedRoutes";
import Dashboard from "../containers/Dashboard";
import Logout from "../containers/Logout";
import Feed from "../containers/Feed";
import Register from "../containers/Register";
import Home from "../containers/Home";
import AboutUs from "../containers/AboutUs";
import Guidelines from "../containers/Guidelines";
import { getUserInfo } from "../features/helpers";
import NavBar from "../containers/NavBar";
import Settings from "../containers/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <NavBar />,
    loader: getUserInfo,
    children: [
      {
        path: "feed",
        element: <Feed />,
      },
      { path: "register", element: <Register /> },
      { path: "", element: <Home /> },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "guidelines",
        element: <Guidelines />,
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: (
          <AuthenticatedRoute>
            <Dashboard />
          </AuthenticatedRoute>
        ),
      },
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },
]);

export default router;
