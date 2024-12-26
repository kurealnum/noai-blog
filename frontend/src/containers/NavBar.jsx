import "../styles/NavBar.css";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import Logo from "/public/shortlogo.svg";
import {
  Add,
  ExpandLess,
  ExpandMore,
  Notifications,
  NotificationsActive,
} from "@mui/icons-material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Fade, Popper } from "@mui/material";

function NavBar() {
  const userData = useLoaderData();
  const [exists, setExists] = useState(userData["profile_picture"] != null);
  const [open, setOpen] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(
    userData != null ? userData["notifications"] > 0 : false,
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  return (
    <>
      <nav>
        <div className="nav-left">
          {Object.keys(userData).length === 0 ? (
            <Link id="log-in-button" to="/login">
              Log in
            </Link>
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
                <img
                  alt="Profile Picture"
                  id="pfp"
                  src={userData["profile_picture"]}
                  onError={() => setExists(false)}
                ></img>
              ) : null}
              {open ? <ExpandLess /> : <ExpandMore />}{" "}
              <Popper anchorEl={anchorEl} open={open} transition>
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={140}>
                    <ul className="dropdown-list">
                      <li>
                        <Link to={"/dashboard"}>Dashboard</Link>
                      </li>
                      <li>
                        <Link to={"/homepage/" + userData["username"]}>
                          Homepage
                        </Link>
                      </li>
                      <li>
                        <Link to="/settings">Settings</Link>
                      </li>
                      <hr></hr>
                      <li>
                        <Link to="/faq">FAQ</Link>
                      </li>
                      <li>
                        <Link to="/guidelines">Guidelines</Link>
                      </li>
                      <li>
                        <Link to="/about-us">About Us</Link>
                      </li>
                      <li>
                        <a href="https://github.com/kurealnum/byeAI/releases/">
                          Changelog
                        </a>
                      </li>
                      <li>
                        <a href="https://github.com/kurealnum/byeAI/issues">
                          Issues
                        </a>
                      </li>
                      <hr></hr>
                      <li>
                        <Link to="/logout">Logout</Link>
                      </li>
                    </ul>
                  </Fade>
                )}
              </Popper>
            </button>
          )}
          <ul>
            <li className="navbar-item">
              <Link to="/feed">
                <LibraryBooksIcon />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/create-post">
                <Add />
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to={"/notifications"}
                onClick={() => setIsNewNotification(false)}
              >
                {isNewNotification ? (
                  <NotificationsActive />
                ) : (
                  <Notifications />
                )}
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/about-us">
          <img id="logo" src={Logo} alt="Logo"></img>
        </Link>
      </nav>
      <Outlet />
    </>
  );
}

export default NavBar;
