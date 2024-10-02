import { Dialog, IconButton } from "@mui/material";
import "../styles/NavBar.css";
import { Outlet, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { doesPathExist } from "../features/helpers";

function NavBar() {
  const desktopWidth = 800;
  const isDesktop = window.innerWidth >= desktopWidth;
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
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (userData != null) {
      doesPathExist(userData["profile_picture"]).then((res) => {
        if (res) {
          setExists(true);
        }
      });
    }
  }, [userData]);

  return (
    <nav>
      <a href={"/settings"} className="username-box">
        {exists ? <img id="pfp" src={userData["profile_picture"]}></img> : null}
        <span>
          {userData != null ? userData.username : <a href="/login">Log in</a>}
        </span>
      </a>
      <NavBarContent userData={userData} />
    </nav>
  );
}

function MobileNavBar({ userData }) {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (userData != null) {
      doesPathExist(userData["profile_picture"]).then((res) => {
        if (res) {
          setExists(true);
        }
      });
    }
  }, [userData]);
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
        <NavBarContent userData={userData} />
      </Dialog>
      <span>
        {userData != null ? userData.username : <a href="/login">Log in</a>}
      </span>
      <button onClick={() => handleOpen()} data-testid="menu-open">
        {exists ? <img id="pfp" src={userData["profile_picture"]}></img> : null}
      </button>
    </nav>
  );
}

// This is just the content for the nav bar. It's the same across both the mobile and full screen nav bar
function NavBarContent({ userData }) {
  if (userData != null) {
    return (
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
          <a href={"/homepage/" + userData.username}>Your homepage</a>
        </li>
        <li>
          <a href="/settings">Settings</a>
        </li>
        <li>
          <a href="/about-us">About Us</a>
        </li>
        <li>
          <a href="/logout">Logout</a>
        </li>
      </div>
    );
  }
  return (
    // don't need a log in link because thats taken care of by the base nav bar
    <div className="link-list">
      <li>
        <a href="/feed">Feed</a>
      </li>
      <li>
        <a href="/register">Register</a>
      </li>
    </div>
  );
}

export default NavBar;
