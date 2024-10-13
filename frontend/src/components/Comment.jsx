import { CalendarMonth, Delete } from "@mui/icons-material";
import { cleanDateTimeField, deleteComment } from "../features/helpers";
import { useState } from "react";
import { Link, useRouteLoaderData } from "react-router-dom";
import { Dialog } from "@mui/material";

// isNotification will cause the comment to link to the post itself, not the user
function Comment({ content, isReply, isNotification }) {
  const [isProfilePicture, setIsProfilePicture] = useState(true);
  const userData = useRouteLoaderData("root");
  const [open, setOpen] = useState(false);
  function handleClose() {
    setOpen(false);
  }

  function dialogHelper(e) {
    const id = e.target.dataset["id"];
    deleteComment(id).then((res) => {
      if (res) {
        setOpen(false);
      }
    });
  }

  const mainComment = (
    <li className={isReply ? "comment comment-reply" : "comment"}>
      <div className="top-bar">
        {isNotification ? (
          <div className="comment-username-box">
            {isProfilePicture ? (
              <img
                className="pfp"
                src={content["user"]["profile_picture"]}
                onError={() => setIsProfilePicture(false)}
              ></img>
            ) : null}
            <span>{content["user"]["username"]}</span>
          </div>
        ) : (
          <Link to={"/homepage/" + content["user"]["username"]}>
            <div className="comment-username-box">
              {isProfilePicture ? (
                <img
                  className="pfp"
                  src={content["user"]["profile_picture"]}
                  onError={() => setIsProfilePicture(false)}
                ></img>
              ) : null}
              <span>{content["user"]["username"]}</span>
            </div>
          </Link>
        )}
        <div className="date-field">
          <div className="sub-date-field">
            <CalendarMonth />
            <p>{cleanDateTimeField(content["created_date"])}</p>
          </div>
          {cleanDateTimeField(content["created_date"]) !=
          cleanDateTimeField(content["updated_date"]) ? (
            <p className="edited-on">
              Edited on {cleanDateTimeField(content["updated_date"])}
            </p>
          ) : null}
        </div>
      </div>
      <p className="comment-content">{content["content"]}</p>
      {userData != undefined &&
      userData["username"] == content["user"]["username"] ? (
        <>
          <button onClick={() => setOpen(true)}>
            <Delete />
          </button>
          <Dialog
            open={open}
            className="delete-post-confirm"
            onClose={handleClose}
          >
            <h1>This will delete your comment forever! Are you sure?</h1>
            <button
              data-id={content.id}
              onClick={(e) => dialogHelper(e)}
              className="accent-border"
            >
              Yes, I am sure
            </button>
            <button onClick={handleClose} className="tertiary-border">
              No, I'm not
            </button>
          </Dialog>
        </>
      ) : null}
    </li>
  );

  if (isNotification) {
    return (
      <Link
        className="link-comment"
        to={
          "/post/" +
          content["post"]["user"]["username"] +
          "/" +
          content["post"]["slug_field"]
        }
      >
        {mainComment}
      </Link>
    );
  } else {
    return <>{mainComment}</>;
  }
}

export default Comment;
