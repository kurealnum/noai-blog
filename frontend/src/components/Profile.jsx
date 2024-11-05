import { CheckCircle, Delete } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { adminDeleteUser, isAdmin } from "../features/helpers";
import FlagButton from "./FlagButton";
import { Dialog } from "@mui/material";

function Profile({ content, isAdminDashboard, refetch }) {
  const [isProfilePicture, setIsProfilePicture] = useState(true);
  const [open, setOpen] = useState(false);

  function adminDeleteDialogHelper() {
    adminDeleteUser(content["user"]["username"]).then((res) => {
      if (res) {
        setOpen(false);
        refetch();
      }
    });
  }

  return (
    <div className="profile">
      {isProfilePicture ? (
        <>
          {content["user"]["profile_picture"] != null ? (
            <img
              alt="Profile Picture"
              className="pfp"
              src={content["user"]["profile_picture"]}
              onError={() => setIsProfilePicture(false)}
            ></img>
          ) : null}
        </>
      ) : null}
      <Link to={"/homepage/" + content["user"]["username"]}>
        <span>{content["user"]["username"]}</span>
      </Link>
      {content["user"]["approved_ai_usage"] ? (
        <Link to="/guidelines#green-checkmarks-on-users-profiles">
          <CheckCircle />
        </Link>
      ) : null}
      {isAdminDashboard && isAdmin() ? (
        <>
          <FlagButton
            type={"user"}
            isFlaggedParam={content["user"]["flagged"]}
            content={content["user"]}
          />
          <div className="flex-row-spacing">
            <button
              onClick={() => {
                alert(
                  "You are about to PERMANENTLY DELETE someone else's account. Are you sure about this?",
                );
                setOpen(true);
              }}
            >
              <Delete />
            </button>
            <Dialog
              open={open}
              className="delete-post-confirm"
              onClose={() => setOpen(false)}
            >
              <h1>
                This will delete someone's account FOREVER!!! Are you sure you
                want to continue?
              </h1>
              <button
                onClick={() => adminDeleteDialogHelper()}
                className="accent-border"
              >
                Yes, I am sure
              </button>
              <button
                onClick={() => setOpen(false)}
                className="tertiary-border"
              >
                No, I'm not
              </button>
            </Dialog>
          </div>
        </>
      ) : null}
    </div>
  );
  // double check with both {isAdmin && isAdmin()}
}

export default Profile;
