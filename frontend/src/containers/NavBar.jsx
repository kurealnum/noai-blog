import { Dialog, IconButton } from "@mui/material";
import "../styles/NavBar.css";
import { Outlet, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useQuery } from "@tanstack/react-query";
import { doesPathExist } from "../features/helpers";

function NavBar() {
  const desktopWidth = 800;
  const isDesktop = window.innerWidth > desktopWidth;
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
      <div className="username-box">
        {exists ? <img id="pfp" src={userData["profile_picture"]}></img> : null}
        <span>
          {userData != null ? userData.username : <a href="/login">Log in</a>}
        </span>
      </div>
      <NavBarContent />
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
        <NavBarContent />
      </Dialog>
      <span>
        {userData != null ? userData.username : <a href="/login">Log in</a>}
      </span>
      <button onClick={() => handleOpen()} data-testid="menu-open">
        <img id="pfp" src={userData["profile_picture"]}></img>
      </button>
    </nav>
  );
}

// This is just the content for the nav bar. It's the same across both the mobile and full screen nav bar
function NavBarContent() {
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
        <a href="/about-us">About Us</a>
      </li>
      <li>
        <a href="/">About Us</a>
      </li>
    </div>
  );
}

export default NavBar;
