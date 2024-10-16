import { useState } from "react";
import { Link } from "react-router-dom";

function Profile({ content }) {
  const [isProfilePicture, setIsProfilePicture] = useState(true);
  return (
    <Link to={"/homepage/" + content["user"]["username"]}>
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
        <span>{content["user"]["username"]}</span>
      </div>
    </Link>
  );
}

export default Profile;
