import { CheckCircle } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";

function Profile({ content }) {
  const [isProfilePicture, setIsProfilePicture] = useState(true);
  return (
    <>
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
      </div>
    </>
  );
}

export default Profile;
