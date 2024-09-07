import { useEffect, useState } from "react";
import { Outlet, useRouteLoaderData } from "react-router-dom";
import getCookie from "../features/helpers";
import { Alert, Snackbar } from "@mui/material";
import "../styles/Settings.css";

function Settings() {
  const userData = useRouteLoaderData("root")[0];
  const [newUserData, setNewUserData] = useState(userData);
  const [links, setLinks] = useState([]);
  const [newLinks, setNewLinks] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    getLinks().then((res) => {
      setLinks(res);
      setNewLinks(res);
    });
  }, []);

  function setNewUserDataHelper(e) {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  }

  function setNewLinksHelper(e, index) {
    const newLinksTemp = newLinks;
    newLinksTemp[index] = {
      ...newLinks[index],
      [e.target.name]: e.target.value,
    };
    setNewLinks(newLinksTemp);
  }

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsError(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSaved(false);
  };

  return (
    <>
      <div id="settings">
        <div className="item">
          <label>Username</label>
          <input
            name="username"
            onChange={(e) => setNewUserDataHelper(e)}
            value={newUserData["username"]}
            maxLength={150}
          ></input>
        </div>
        <div className="item">
          <label>Email</label>
          <input
            name="email"
            onChange={(e) => setNewUserDataHelper(e)}
            value={newUserData["email"]}
            maxLength={200}
          ></input>
        </div>
        <div className="item">
          <label>First name</label>
          <input
            name="first_name"
            onChange={(e) => setNewUserDataHelper(e)}
            value={newUserData["first_name"]}
            maxLength={50}
          ></input>
        </div>
        <div className="item">
          <label>Last name</label>
          <input
            name="last_name"
            onChange={(e) => setNewUserDataHelper(e)}
            value={newUserData["last_name"]}
            maxLength={50}
          ></input>
        </div>
        <div className="item">
          <label>About me</label>
          <textarea
            name="about_me"
            onChange={(e) => setNewUserDataHelper(e)}
            value={newUserData["about_me"]}
            maxLength={250}
          ></textarea>
        </div>
        <div className="item">
          <label>Technical Info</label>
          <textarea
            name="technical_info"
            onChange={(e) => setNewUserDataHelper(e)}
            value={newUserData["technical_info"]}
            maxLength={150}
          ></textarea>
        </div>
        <h2>Links</h2>
        {links.map((content, index) => (
          <div className="item" key={index}>
            <input
              defaultValue={content["name"]}
              name="name"
              onChange={(e) => setNewLinksHelper(e, index)}
            ></input>
            <input
              name="link"
              defaultValue={content["link"]}
              onChange={(e) => setNewLinksHelper(e, index)}
            ></input>
          </div>
        ))}
        <button
          id="save"
          onClick={() =>
            changeSettings(newUserData, setIsError, setIsSaved, newLinks)
          }
        >
          Save
        </button>
        <Snackbar
          open={isError}
          autoHideDuration={5000}
          onClose={handleCloseError}
        >
          <Alert onClose={handleCloseError} severity="error" variant="filled">
            Something went wrong!
          </Alert>
        </Snackbar>
        <Snackbar
          open={isSaved}
          autoHideDuration={5000}
          onClose={handleCloseSuccess}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            variant="filled"
          >
            Your changes were successfully saved!
          </Alert>
        </Snackbar>
      </div>
      <Outlet />
    </>
  );
}

async function changeSettings(newUserData, setIsError, setIsSaved, newLinks) {
  const userInfoConfig = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PUT",
    body: JSON.stringify(newUserData),
  };
  const userInfoResponse = await fetch(
    "/api/accounts/update-user-info/" + getCookie("user_id") + "/",
    userInfoConfig,
  );

  const linksConfig = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PUT",
    body: JSON.stringify(newLinks),
  };
  const linksResponse = await fetch("/api/accounts/save-links/", linksConfig);
  if (userInfoResponse.ok && linksResponse.ok) {
    setIsSaved(true);
  } else {
    setIsError(true);
  }
}

async function getLinks() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/accounts/user-links/", config);
  return await response.json();
}

export default Settings;
