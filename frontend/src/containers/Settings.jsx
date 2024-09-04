import { useState } from "react";
import { Outlet, useRouteLoaderData } from "react-router-dom";
import getCookie from "../features/helpers";
import { Alert, Snackbar } from "@mui/material";
import "../styles/Settings.css";

function Settings() {
  const userData = useRouteLoaderData("root")[0];
  const [newUserData, setNewUserData] = useState(userData);
  const [isError, setIsError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function setNewUserDataHelper(e) {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  }

  function settingTitleHelper(string) {
    return (string.charAt(0).toUpperCase() + string.slice(1)).replace(/_/, " ");
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
        {Object.keys(userData).map((keyName, key) => (
          <div className="item" key={key}>
            <label>{settingTitleHelper(keyName)}</label>
            <input
              name={keyName}
              onChange={(e) => setNewUserDataHelper(e)}
              value={newUserData[keyName]}
            ></input>
          </div>
        ))}
        <button
          id="save"
          onClick={() => changeSettings(newUserData, setIsError, setIsSaved)}
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

async function changeSettings(newUserData, setIsError, setIsSaved) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PUT",
    body: JSON.stringify(newUserData),
  };
  const response = await fetch(
    "/api/accounts/update-user-info/" + getCookie("user_id") + "/",
    config,
  );
  if (response.ok) {
    setIsSaved(true);
  } else {
    setIsError(true);
  }
}

export default Settings;
