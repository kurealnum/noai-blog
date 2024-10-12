import { CalendarMonth } from "@mui/icons-material";
import { cleanDateTimeField } from "../features/helpers";
import { useState } from "react";

function Comment({ content, isReply }) {
  const [isProfilePicture, setIsProfilePicture] = useState(true);
  return (
    <li className={isReply ? "comment comment-reply" : "comment"}>
      <div className="top-bar">
        <div class="comment-username-box">
          {isProfilePicture ? (
            <img
              className="pfp"
              src={content["user"]["profile_picture"]}
              onError={() => setIsProfilePicture(false)}
            ></img>
          ) : null}
          <span>{content["user"]["username"]}</span>
        </div>
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
}

export default Comment;
