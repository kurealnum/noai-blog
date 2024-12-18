// not sure why we have to do this... but yes.
import { lazy } from "react";
export const Faq = lazy(() => import("../containers/Faq.jsx"));
export const Login = lazy(() => import("../containers/Login"));
export const Dashboard = lazy(() => import("../containers/Dashboard"));
export const Logout = lazy(() => import("../containers/Logout"));
export const Feed = lazy(() => import("../containers/Feed"));
export const Register = lazy(() => import("../containers/Register"));
export const Home = lazy(() => import("../containers/Home"));
export const AboutUs = lazy(() => import("../containers/AboutUs"));
export const Guidelines = lazy(() => import("../containers/Guidelines"));
export const NavBar = lazy(() => import("../containers/NavBar"));
export const Settings = lazy(() => import("../containers/Settings"));
export const Homepage = lazy(() => import("../containers/Homepage"));
export const BlogPost = lazy(() => import("../containers/BlogPost"));
export const RootBoundary = lazy(() => import("../containers/RootBoundary"));
export const CreatePost = lazy(() => import("../containers/CreatePost"));
export const LoginRedirect = lazy(() => import("../containers/LoginRedirect"));
export const Notifications = lazy(() => import("../containers/Notifications"));
export const EditPost = lazy(() => import("../containers/EditPost"));
export const Followers = lazy(() => import("../containers/Followers"));
export const Following = lazy(() => import("../containers/Following"));
export const AdminDashboard = lazy(
  () => import("../containers/AdminDashboard"),
);
