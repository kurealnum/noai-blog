import { Dialog, IconButton } from "@mui/material";
import "../styles/NavBar.css";
import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

function NavBar() {
  const desktopWidth = 800;
  const isDesktop = window.innerWidth > desktopWidth;
  // index here because DRF sends models in a silly way
  let userData = useLoaderData();
  if (isDesktop) {
    return (
      <>
        <FullScreenNavBar userData={userData} />
        <Outlet />
      </>
    );
  }
  return (
    <>
      <MobileNavBar userData={userData} />
      <Outlet />
    </>
  );
}

function FullScreenNavBar({ userData }) {
  return (
    <nav>
      <div className="username-box">
        <img
          id="pfp"
          src="https://media.dev.to/cdn-cgi/image/width=320,height=320,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F1079248%2F6f43bf7a-eebe-414c-9404-4cc9765ac588.jpg"
        ></img>
        <span>
          {userData != null ? userData.username : <a href="/login">Log in</a>}
        </span>
      </div>
      <div className="link-list">
        <li>
          <a href="/guidelines">Policies on AI</a>
        </li>
        <li>
          <a href="/feed">Feed</a>
        </li>
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        <li>
          <a href="/about-us">About Us</a>
        </li>
        <li>
          <a href="/">About Us</a>
        </li>
      </div>
    </nav>
  );
}

function MobileNavBar({ userData }) {
  // long asf link to my profile picture. will change when actually using img from api
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  // clicking (or should i say tapping) on your profile picture currently just opens the hamburger menu
  return (
    <nav>
      <button id="menu-icon" onClick={() => handleOpen()}>
        <MenuIcon />
      </button>
      <Dialog fullScreen open={open} onClose={() => handleClose()}>
        <div id="dialog-close-button">
          <IconButton onClick={() => handleClose()}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
        <div className="link-list">
          <li>
            <a href="/guidelines">Policies on AI</a>
          </li>
          <li>
            <a href="/feed">Feed</a>
          </li>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/about-us">About Us</a>
          </li>
          <li>
            <a href="/">Homepage</a>
          </li>
        </div>
      </Dialog>
      <span>
        {userData != null ? userData.username : <a href="/login">Log in</a>}
      </span>
      <button onClick={() => handleOpen()}>
        <img
          id="pfp"
          src="https://media.dev.to/cdn-cgi/image/width=320,height=320,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F1079248%2F6f43bf7a-eebe-414c-9404-4cc9765ac588.jpg"
        ></img>
      </button>
    </nav>
  );
}

export default NavBar;
