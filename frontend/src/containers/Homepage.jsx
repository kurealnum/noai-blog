import { useEffect, useState } from "react";
import { useParams, useRouteLoaderData } from "react-router-dom";
import "../styles/Homepage.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  getUserInfoByUsername,
  getBlogPosts,
  getLinks,
  doesPathExist,
  getUserInfo,
  isFollowingUser,
  followUser,
  unfollowUser,
} from "../features/helpers";
import BlogPostThumbnail from "../components/BlogPostThumbnail";

function Homepage() {
  const { username } = useParams();
  const currentUserInfo = useRouteLoaderData("root");
  const [userInfo, setUserInfo] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [links, setLinks] = useState([]);
  const [doesUserExist, setDoesUserExist] = useState(false);
  const [doesExist, setDoesExist] = useState();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    getUserInfoByUsername(username).then((res) => {
      setUserInfo(res);
      if (res != null) {
        setDoesUserExist(true);
        doesPathExist(res["profile_picture"]).then((result) => {
          if (result) {
            setDoesExist(true);
          } else {
            setDoesExist(false);
          }
        });
      }
    });
    getBlogPosts(username).then((res) => {
      setBlogPosts(res);
    });
    getLinks(username).then((res) => {
      setLinks(res);
      document.title = "NoAI Blog" + " - " + username;
    });
    // see comments in helpers.js for this function
    isFollowingUser(username).then((res) => {
      if (!res) {
        setIsFollowing(false);
      } else {
        setIsFollowing(true);
      }
    });
  }, [username]);

  function followHelper() {
    // prevents user from following themselves
    if (
      currentUserInfo["username"] != null &&
      currentUserInfo["username"] !== userInfo["username"]
    ) {
      followUser(username).then((res) => {
        if (res) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      });
    }
  }

  function unfollowHelper() {
    unfollowUser(username).then((res) => {
      if (res) {
        setIsFollowing(false);
      } else {
        setIsFollowing(true);
      }
    });
  }

  if (doesUserExist) {
    return (
      <div id="homepage">
        <div className="user-box">
          <div className="username-box">
            {doesExist ? (
              <img id="pfp" src={userInfo["profile_picture"]}></img>
            ) : null}
            <span>{userInfo["username"]}</span>
          </div>
          <button
            onClick={
              isFollowing ? () => unfollowHelper() : () => followHelper()
            }
            id="follow"
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
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
                <BlogPostThumbnail
                  key={index}
                  title={content.title}
                  username={content.user.username}
                  createdDate={content.created_date}
                  content={content.content}
                />
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
