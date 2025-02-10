import "../styles/NavBar.css";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import Logo from "/public/shortlogo.svg";
import {
  Add,
  ExpandLess,
  ExpandMore,
  Feed,
  FormatListNumbered,
  Instagram,
  Notifications,
  NotificationsActive,
  Twitter,
  YouTube,
} from "@mui/icons-material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Fade, Popper, Tooltip } from "@mui/material";
import TikTokIcon from "../components/svgs/TikTokIcon.jsx";
import PopUp from "../components/PopUp.jsx";

function NavBar() {
  const userData = useLoaderData();
  const [exists, setExists] = useState(userData["profile_picture"] != null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(
    userData != null ? userData["notifications"] > 0 : false,
  );

  function isAnyModalOpen() {
    return userModalOpen || feedModalOpen;
  }

  function closeAllModals() {
    setUserModalOpen(false);
    setFeedModalOpen(false);
  }

  const [userModalAnchorEl, setUserModalAnchorEl] = useState(null);
  const userModalHandleClick = (event) => {
    setUserModalAnchorEl(event.currentTarget);
    if (!userModalOpen && isAnyModalOpen()) {
      closeAllModals();
    }
    setUserModalOpen((previousOpen) => !previousOpen);
  };

  const [feedModalAnchorEl, setFeedModalAnchorEl] = useState(null);
  const feedModalHandleClick = (event) => {
    setFeedModalAnchorEl(event.currentTarget);
    if (!feedModalOpen && isAnyModalOpen()) {
      closeAllModals();
    }
    setFeedModalOpen((previousOpen) => !previousOpen);
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
              aria-controls={userModalOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={userModalOpen ? "true" : undefined}
              onClick={userModalHandleClick}
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
              {userModalOpen ? <ExpandLess /> : <ExpandMore />}{" "}
              <Popper
                anchorEl={userModalAnchorEl}
                open={userModalOpen}
                transition
              >
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
                        <Link to="/user-documentation">Docs</Link>
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
                        <div className="socials">
                          <a href="https://x.com/byeai_">
                            <Twitter />
                          </a>
                          <a href="https://www.instagram.com/byeai_/">
                            <Instagram />
                          </a>
                          <a href="https://www.tiktok.com/@byeai_">
                            <TikTokIcon />
                          </a>
                          <a href="https://www.youtube.com/@byeAIplatform">
                            <YouTube />
                          </a>
                        </div>
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
              <button
                aria-controls={feedModalOpen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={feedModalOpen ? "true" : undefined}
                onClick={feedModalHandleClick}
                data-testid="open-dropdown"
              >
                <LibraryBooksIcon />
              </button>
            </li>
            <Popper
              anchorEl={feedModalAnchorEl}
              open={feedModalOpen}
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={140}>
                  <ul className="dropdown-list dropdown-list-horizontal">
                    <li className="navbar-item">
                      <Link to="/feed">
                        <Tooltip title="Articles">
                          <Feed />
                        </Tooltip>
                      </Link>
                    </li>
                    <li className="navbar-item">
                      <Link to="/lists">
                        <Tooltip title="Lists">
                          <FormatListNumbered />
                        </Tooltip>
                      </Link>
                    </li>
                  </ul>
                </Fade>
              )}
            </Popper>
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
      <PopUp popUpId="baseAdvertisement" timesToShowPopUp={3}>
        <p>Did you know that byeAI now supports crossposting?</p>
      </PopUp>
      <Outlet />
    </>
  );
}

export default NavBar;
