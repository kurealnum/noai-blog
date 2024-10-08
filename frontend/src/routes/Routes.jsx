/* v8 ignore start */
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
import Homepage from "../containers/Homepage";
import BlogPost from "../containers/BlogPost";
import PublicRoute from "./PublicRoutes";
import Page from "./Page";
import RootBoundary from "../containers/RootBoundary";
import CreatePost from "../containers/CreatePost";
import LoginRedirect from "../containers/LoginRedirect";
import Notifications from "../containers/Notifications";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <Page title="Home">
        <Home />
      </Page>
    ),
  },
  {
    path: "/",
    id: "root",
    element: <NavBar />,
    loader: getUserInfo,
    errorElement: <RootBoundary />,
    children: [
      {
        path: "login-redirect",
        element: <LoginRedirect />,
      },
      { path: "notifications", element: <Notifications /> },
      {
        path: "homepage/:username",
        element: (
          <Page title="Homepage">
            <Homepage />
          </Page>
        ),
      },
      {
        path: "create-post",
        element: (
          <Page title="Create post">
            <CreatePost />
          </Page>
        ),
      },
      {
        path: "feed",
        element: (
          <Page title="Feed">
            <Feed />
          </Page>
        ),
      },
      {
        path: "register",
        element: (
          <Page title="Register">
            <PublicRoute>
              <Register />
            </PublicRoute>
          </Page>
        ),
      },
      {
        path: "about-us",
        element: (
          <Page title="About Us">
            <AboutUs />
          </Page>
        ),
      },
      {
        path: "settings",
        element: (
          <Page title="Settings">
            <AuthenticatedRoute>
              <Settings />
            </AuthenticatedRoute>
          </Page>
        ),
      },
      {
        path: "guidelines",
        element: (
          <Page title="Guidelines">
            <Guidelines />
          </Page>
        ),
      },
      {
        path: "login",
        element: (
          <Page title="Login">
            <PublicRoute>
              <Login />
            </PublicRoute>
          </Page>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Page title="Dashboard">
            <AuthenticatedRoute>
              <Dashboard />
            </AuthenticatedRoute>
          </Page>
        ),
      },
      {
        path: "logout",
        element: (
          <Page title="Logout">
            <AuthenticatedRoute>
              <Logout />
            </AuthenticatedRoute>
          </Page>
        ),
      },
      {
        path: "post/:username/:slug",
        element: (
          <Page>
            <BlogPost />
          </Page>
        ),
      },
    ],
  },
]);

export default router;
