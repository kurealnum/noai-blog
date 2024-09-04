import { useState } from "react";
import { Outlet, useRouteLoaderData } from "react-router-dom";
import getCookie from "../features/helpers";

function Settings() {
  const userData = useRouteLoaderData("root")[0];
  const [newUserData, setNewUserData] = useState(userData);

  function setNewUserDataHelper(e) {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  }

  function settingTitleHelper(string) {
    return (string.charAt(0).toUpperCase() + string.slice(1)).replace(/_/, " ");
  }

  return (
    <>
      <div id="settings">
        {Object.keys(userData).map((keyName, key) => (
          <div className="item" key={key}>
            <span>{settingTitleHelper(keyName)}</span>
            <input
              onChange={(e) => setNewUserDataHelper(e)}
              content={userData[keyName]}
            ></input>
          </div>
        ))}
        <button onClick={() => changeSettings(newUserData)}>Save</button>
      </div>
      <Outlet />
    </>
  );
}

async function changeSettings({ newUserData }) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PUT",
    body: JSON.stringify(newUserData),
  };
  const response = fetch("/api/accounts/update-user-info/", config);
  console.log(response);
}

export default Settings;
