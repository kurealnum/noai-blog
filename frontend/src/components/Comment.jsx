import { CalendarMonth, Close, Delete, Edit } from "@mui/icons-material";
import {
  cleanDateTimeField,
  createComment,
  deleteComment,
  editComment,
  getPostType,
  isAdmin,
  isAuthenticated,
} from "../features/helpers";
import { useState } from "react";
import { Link, useParams, useRouteLoaderData } from "react-router-dom";
import { Dialog } from "@mui/material";
import { Reply } from "@mui/icons-material";
import FlagButton from "./FlagButton";

// isNotification will cause the comment to link to the post itself, not the user
function Comment({
  content,
  isReply,
  isNotification,
  refetch,
  isAdminDashboard,
  id,
}) {
  let { username, slug } = useParams();
  if (!slug) {
    slug = content["post"]["slug_field"];
  }
  const [isProfilePicture, setIsProfilePicture] = useState(true);
  const [editInputOpen, setEditInputOpen] = useState(false);
  const [editReplyOpen, setEditReplyOpen] = useState(false);
  const userData = useRouteLoaderData("root");
  const [open, setOpen] = useState(false);
  const type = getPostType();

  function handleClose() {
    setOpen(false);
  }

  function deleteDialogHelper(e) {
    const id = e.target.dataset["id"];
    deleteComment(id).then((res) => {
      if (res) {
        setOpen(false);
        refetch();
      }
    });
  }

  function adminDeleteDialogHelper() {
    deleteComment(content["id"]).then((res) => {
      if (res) {
        setOpen(false);
        refetch();
      }
    });
  }

  function editHelper(e) {
    e.preventDefault();
    const id = e.target[1].dataset["id"];
    const content = e.target[0].value;
    editComment(id, content).then((res) => {
      if (res) {
        setEditInputOpen(false);
        refetch();
      }
    });
  }

  function replyHelper(e) {
    e.preventDefault();
    const content = e.target[0].value;
    const replyTo = e.target[1].dataset["id"];
    createComment(username, slug, content, replyTo).then((res) => {
      if (res) {
        setEditReplyOpen(false);
        refetch();
      }
    });
  }

  const mainComment = (
    <>
      <li
        className={
          (isReply ? "comment comment-reply" : "comment") +
          (content["is_read"] ? " " : " unread-notification")
        }
        key={id}
      >
        <div className="top-bar">
          {isNotification ? (
            <div className="comment-username-box">
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
              <span>{content["user"]["username"]}</span>
            </div>
          ) : (
            <Link to={"/homepage/" + content["user"]["username"]}>
              <div className="comment-username-box">
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
          <FlagButton
            type={"comment"}
            isFlaggedParam={content["flagged"]}
            content={content}
          />
        </div>
        {editInputOpen ? (
          <form onSubmit={(e) => editHelper(e)} className={"edit-comment-form"}>
            <textarea />
            <div className="edit-buttons">
              <button
                type="submit"
                className="tertiary-accent"
                data-id={content["id"]}
              >
                Save
              </button>
              <button
                className="accent-highlight"
                type="button"
                id="close"
                onClick={() => setEditInputOpen(false)}
              >
                <Close />
              </button>
            </div>
          </form>
        ) : (
          <p
            className="comment-content"
            data-testid={"comment" + content["id"]}
          >
            {content["content"]}
          </p>
        )}
        {isNotification ? null : (
          <div className="edit-buttons">
            {isAuthenticated() && !isAdminDashboard ? (
              <button onClick={() => setEditReplyOpen(true)}>
                <Reply />
              </button>
            ) : null}
            {userData != undefined &&
            userData["username"] == content["user"]["username"] &&
            !isAdminDashboard ? (
              <div className="edit-buttons right-align">
                <button
                  onClick={() => setOpen(true)}
                  data-testid={"delete-comment" + content["id"]}
                >
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
                    onClick={(e) => deleteDialogHelper(e)}
                    className="accent-border"
                  >
                    Yes, I am sure
                  </button>
                  <button onClick={handleClose} className="tertiary-border">
                    No, I'm not
                  </button>
                </Dialog>
                <button
                  onClick={() => setEditInputOpen(true)}
                  data-testid={"delete-comment" + content["id"]}
                >
                  <Edit />
                </button>
              </div>
            ) : null}
            {isAdminDashboard && isAdmin() ? (
              <div className="flex-row-spacing">
                <button onClick={() => setOpen(true)}>
                  <Delete />
                </button>
                <Dialog
                  open={open}
                  className="delete-post-confirm"
                  onClose={() => setOpen(false)}
                >
                  <h1>
                    This will delete SOMEONE ELSE'S COMMENT FOREVER!!! Are you
                    sure?
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
            ) : null}
          </div>
        )}
      </li>
      {editReplyOpen ? (
        <form
          onSubmit={(e) => replyHelper(e)}
          className={
            isReply ? "reply-to-reply-comment-form" : "reply-comment-form"
          }
        >
          <textarea />
          <div className="edit-buttons">
            <button
              type="submit"
              className="tertiary-accent"
              data-id={content["id"]}
            >
              Reply
            </button>
            <button
              className="accent-highlight"
              type="button"
              id="close"
              onClick={() => setEditReplyOpen(false)}
            >
              <Close />
            </button>
          </div>
        </form>
      ) : null}
    </>
  );

  if (isNotification) {
    return (
      <Link to={"/post/" + content["post"]["user"]["username"] + "/" + slug}>
        {mainComment}
      </Link>
    );
  }
  return <>{mainComment}</>;
}

export default Comment;
