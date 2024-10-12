import { CalendarMonth } from "@mui/icons-material";
import { cleanDateTimeField } from "../features/helpers";
import { useState } from "react";
import { Link } from "react-router-dom";

// isNotification will cause the comment to link to the post itself, not the user
function Comment({ content, isReply, isNotification }) {
  const [isProfilePicture, setIsProfilePicture] = useState(true);
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
