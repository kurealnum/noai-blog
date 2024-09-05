import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Homepage() {
  const [userInfo, setUserInfo] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [doesUserExist, setDoesUserExist] = useState(false);
  const { username } = useParams();

  useEffect(() => {
    getUserInfo(username, setDoesUserExist).then((res) => {
      setUserInfo(res[0]);
    });
    getBlogPosts(username).then((res) => {
      setBlogPosts(res[0]);
    });
  }, [username]);

  if (doesUserExist) {
    return (
      <>
        <div className="username-box">
          <img></img>
          <span>{userInfo["username"]}</span>
        </div>
        <button>Follow</button>
        <p id="about-me">{userInfo["about_me"]}</p>
        <div id="member-since">
          <img></img>
          <p>Member since {userInfo["date_joined"].replace(/(T.*)/g, "")}</p>
        </div>
        <div className="technical-info">
          <h2>Technical Info</h2>
          <p>{userInfo["technical_info"]}</p>
        </div>
        <div className="links">
          {userInfo["links"].map((content, index) => {
            <li key={index}>
              <a href={content["link"]}>{content["name"]}</a>
            </li>;
          })}
        </div>
      </>
    );
  } else {
    return <p>The user {username} does not exist!</p>;
  }
}

async function getUserInfo(username, setDoesUserExist) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(
    "/api/accounts/user-info-by-username/" + username + "/",
    config,
  );
  if (response.ok) {
    setDoesUserExist(true);
    return await response.json();
  }
  return;
}

async function getBlogPosts(username) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(
    "/api/blog-posts/get-posts-by-username/" + username + "/",
    config,
  );
  return await response.json();
}

export default Homepage;
