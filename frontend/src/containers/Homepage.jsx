import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Homepage.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  getUserInfo,
  getBlogPosts,
  getLinks,
} from "../features/containerHelpers";

function Homepage() {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [links, setLinks] = useState([]);
  const [doesUserExist, setDoesUserExist] = useState(false);

  useEffect(() => {
    getUserInfo(username).then((res) => {
      setUserInfo(res);
      if (res != null) {
        setDoesUserExist(true);
      }
    });
    getBlogPosts(username).then((res) => {
      setBlogPosts(res);
    });
    getLinks(username).then((res) => {
      setLinks(res);
    });
  }, [username]);

  if (doesUserExist) {
    return (
      <div id="homepage">
        <div className="user-box">
          <div className="username-box">
            <img id="pfp" src={userInfo["profile_picture"]}></img>
            <span>{userInfo["username"]}</span>
          </div>
          <button id="follow">Follow</button>
        </div>
        <div className="general-info">
          <div className="about-me-wrapper">
            <p id="about-me">{userInfo["about_me"]}</p>
            <div id="member-since">
              <CalendarMonthIcon />
              <p>
                Member since {userInfo["date_joined"].replace(/(T.*)/g, "")}
              </p>
            </div>
          </div>
          <div className="technical-info">
            <h2>Technical Info</h2>
            <p>{userInfo["technical_info"]}</p>
          </div>
        </div>
        <div className="extra-info">
          <div className="links">
            <h2>Links</h2>
            {links === null || links.length === 0 ? (
              <p>This user doesn't have any links!</p>
            ) : (
              links.map((content, index) => (
                <li key={index}>
                  <a href={content["link"]}>{content["name"]}</a>
                </li>
              ))
            )}
          </div>
          <div className="list">
            <h2>Blog Posts</h2>
            {blogPosts === null || blogPosts.length === 0 ? (
              <p>There's nothing here. Go make some posts!</p>
            ) : (
              blogPosts.map((content, index) => (
                <div key={index} className="blog-post">
                  <h2>{content.title}</h2>
                  <div className="info">
                    <p>{"By " + content.user.username}</p>
                    <p>{content["created_date"].replace(/(T.*)/g, "")}</p>
                  </div>
                  <p className="hint">
                    {content["content"].length > 100
                      ? content["content"].slice(0, 101) + "..."
                      : content.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <p>The user {username} does not exist!</p>;
  }
}

export default Homepage;
