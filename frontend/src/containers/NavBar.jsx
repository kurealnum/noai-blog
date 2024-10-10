import "../styles/NavBar.css";
import { Outlet, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { doesPathExist } from "../features/helpers";
import Logo from "/public/shortlogo.svg";
import {
  Add,
  ExpandLess,
  ExpandMore,
  Notifications,
} from "@mui/icons-material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Fade, Menu, Popper } from "@mui/material";

function NavBar() {
  const userData = useLoaderData();
  const [exists, setExists] = useState(false);
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

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
    <>
      <nav>
        <div className="nav-left">
          {userData == null ? (
            <a id="log-in-button" href="/login">
              Log in
            </a>
          ) : (
            <button
              className="nav-username-box"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              data-testid="open-dropdown"
            >
              {exists ? (
                <img id="pfp" src={userData["profile_picture"]}></img>
              ) : null}
              {open ? <ExpandLess /> : <ExpandMore />}{" "}
              <Popper anchorEl={anchorEl} open={open} transition>
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={140}>
                    <ul className="dropdown-list">
                      <li>
                        <a href="/dashboard">Dashboard</a>
                      </li>
                      <li>
                        <a href="/homepage">Homepage</a>
                      </li>
                      <li>
                        <a href="/settings">Settings</a>
                      </li>
                      <li>
                        <a href="/logout">Logout</a>
                      </li>
                    </ul>
                  </Fade>
                )}
              </Popper>
            </button>
          )}
          <ul>
            <li className="navbar-item">
              <a href="/feed">
                <LibraryBooksIcon />
              </a>
            </li>
            <li className="navbar-item">
              <a href="/create-post">
                <Add />
              </a>
            </li>
            <li className="navbar-item">
              <a href="/notifications">
                <Notifications />
              </a>
            </li>
          </ul>
        </div>
        <a href="/guidelines">
          <img id="logo" src={Logo} alt="Logo"></img>
        </a>
      </nav>
      <Outlet />
    </>
  );
}

export default NavBar;
