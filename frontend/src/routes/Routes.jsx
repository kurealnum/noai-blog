/* v8 ignore start */
import { createBrowserRouter, json } from "react-router-dom";
import { getUserInfo } from "../features/helpers";
import Page from "./Page.jsx";
import "../styles/TextBasedPage.css";
import {
  Login,
  Dashboard,
  Logout,
  Feed,
  Register,
  Home,
  AboutUs,
  Guidelines,
  NavBar,
  Settings,
  Homepage,
  BlogPost,
  RootBoundary,
  CreatePost,
  LoginRedirect,
  Notifications,
  EditPost,
  Followers,
  Following,
  AdminDashboard,
  Faq,
  ListFeed,
  List,
} from "./LazyImports";
import Search from "../containers/Search.jsx";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <Page title="An AI free community for content creation" type={"public"}>
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
        path: "/list/:username/:slug/",
        element: (
          <Page type={"public"} title={"List"}>
            <List />
          </Page>
        ),
      },
      {
        path: "/search/:type/:query/",
        element: (
          <Page type={"public"} title={"Search"}>
            <Search />
          </Page>
        ),
      },
      {
        path: "/lists",
        element: (
          <Page type={"public"} title={"Lists"}>
            <ListFeed />
          </Page>
        ),
      },
      {
        path: "/search/:type/",
        element: (
          <Page type={"public"} title={"Search"}>
            <Search />
          </Page>
        ),
      },
      {
        path: "/edit-post/:type/:slug",
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
