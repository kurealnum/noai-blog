import "../styles/NavBar.css";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { doesPathExist } from "../features/helpers";
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
  const [exists, setExists] = useState(false);
  const [open, setOpen] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(
    userData != null ? userData["notifications"] > 0 : false,
  );

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
                <img id="pfp" src={userData["profile_picture"]}></img>
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
        <Link to="/guidelines">
          <img id="logo" src={Logo} alt="Logo"></img>
        </Link>
      </nav>
      <Outlet />
    </>
  );
}

export default NavBar;
