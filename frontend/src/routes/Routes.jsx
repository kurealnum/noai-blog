/* v8 ignore start */
import { createBrowserRouter, json } from "react-router-dom";
import Login from "../containers/Login";
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
import Page from "./Page";
import RootBoundary from "../containers/RootBoundary";
import CreatePost from "../containers/CreatePost";
import LoginRedirect from "../containers/LoginRedirect";
import Notifications from "../containers/Notifications";
import Faq from "../containers/Faq";
import EditPost from "../containers/EditPost";
import Followers from "../containers/Followers";
import Following from "../containers/Following";
import AdminDashboard from "../containers/AdminDashboard";
import "../styles/TextBasedPage.css";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <Page title="Home" type={"public"}>
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
        path: "/edit-post/:slug",
        element: (
          <Page type={"private"} title={"Edit Post"}>
            <EditPost />
          </Page>
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <Page title={"Admin Dashboard"} type={"admin"}>
            <AdminDashboard />
          </Page>
        ),
      },
      {
        path: "faq",
        element: (
          <Page type={"public"} title={"FAQ"}>
            <Faq />
          </Page>
        ),
      },
      {
        path: "followers",
        element: (
          <Page title="Followers" type={"private"}>
            <Followers />
          </Page>
        ),
      },
      {
        path: "following",
        element: (
          <Page title="Followers" type={"private"}>
            <Following />
          </Page>
        ),
      },
      {
        path: "login-redirect",
        element: <LoginRedirect />,
      },
      {
        path: "notifications",
        element: (
          <Page title={"Notifications"} type={"private"}>
            <Notifications />{" "}
          </Page>
        ),
      },
      {
        path: "homepage/:username",
        element: (
          <Page title="Homepage" type={"public"}>
            <Homepage />
          </Page>
        ),
      },
      {
        path: "create-post",
        element: (
          <Page title="Create post" type={"private"}>
            <CreatePost />
          </Page>
        ),
      },
      {
        path: "feed",
        element: (
          <Page type="public" title="Feed">
            <Feed />
          </Page>
        ),
      },
      {
        path: "register",
        element: (
          <Page title="Register" type={"public"}>
            <Register />
          </Page>
        ),
      },
      {
        path: "about-us",
        element: (
          <Page title="About Us" type={"public"}>
            <AboutUs />
          </Page>
        ),
      },
      {
        path: "settings",
        element: (
          <Page title="Settings" type={"private"}>
            <Settings />
          </Page>
        ),
      },
      {
        path: "guidelines",
        element: (
          <Page title="Guidelines" type={"public"}>
            <Guidelines />
          </Page>
        ),
      },
      {
        path: "login",
        element: (
          <Page title="Login" type="public">
            <Login />
          </Page>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Page title="Dashboard" type={"private"}>
            <Dashboard />
          </Page>
        ),
      },
      {
        path: "logout",
        element: (
          <Page title="Logout" type={"private"}>
            <Logout />
          </Page>
        ),
      },
      {
        path: "post/:username/:slug",
        element: (
          <Page type={"public"} title={"Blog Post"}>
            <BlogPost />
          </Page>
        ),
      },
      {
        path: "*",
        loader: () => {
          throw json("Page not found!", { status: 404 });
        },
      },
    ],
  },
]);

export default router;
