import "../styles/NavBar.css";
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { doesPathExist } from "../features/helpers";
import Logo from "/public/shortlogo.svg";
import { Add, ExpandMore, Notifications } from "@mui/icons-material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

function NavBar() {
  const userData = useLoaderData();
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
      <div className="nav-left">
        <button className="nav-username-box">
          {userData["username"] == null ? (
            <a href="/login">Log in</a>
          ) : (
            <>
              {exists ? (
                <img id="pfp" src={userData["profile_picture"]}></img>
              ) : null}
              <ExpandMore />
            </>
          )}{" "}
        </button>
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
      <img id="logo" src={Logo} alt="Logo"></img>
    </nav>
  );
}

export default NavBar;
