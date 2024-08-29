import { Dialog, IconButton } from "@mui/material";
import "../styles/NavBar.css";
import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  const desktopWidth = 800;
  const isDesktop = window.innerWidth > desktopWidth;
  // index here because DRF sends models in a silly way
  const userData = useLoaderData()[0];
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
      <div className="username-box">{userData.username}</div>
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
  return (
    <nav>
      <button onClick={() => handleOpen()}>
        <img id="burger-menu" src="../../public/burger-menu.svg"></img>
      </button>
      <Dialog fullScreen open={open} onClose={() => handleClose()}>
        <IconButton onClick={() => handleClose()}>
          <button>Close me!</button>
        </IconButton>
      </Dialog>
      <span>{userData.username}</span>
      <img
        id="pfp"
        src="https://media.dev.to/cdn-cgi/image/width=320,height=320,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F1079248%2F6f43bf7a-eebe-414c-9404-4cc9765ac588.jpg"
      ></img>
    </nav>
  );
}

export default NavBar;
