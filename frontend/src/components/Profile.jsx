import { CheckCircle } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { isAdmin } from "../features/helpers";
import FlagButton from "./FlagButton";

function Profile({ content, showFlagButton }) {
  const [isProfilePicture, setIsProfilePicture] = useState(true);
  return (
    <div className="profile">
      {isProfilePicture ? (
        <>
          {content["user"]["profile_picture"] != null ? (
            <img
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
      {showFlagButton && isAdmin() ? (
        <FlagButton
          type={"user"}
          isFlaggedParam={content["is_flagged"]}
          content={content["user"]}
        />
      ) : null}
    </div>
  );
  // double check with both {isAdmin && isAdmin()}
}

export default Profile;
