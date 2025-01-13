import { useEffect, useState } from "react";
import { useParams, useRouteLoaderData } from "react-router-dom";
import "../styles/Homepage.css";
import {
  getUserInfoByUsername,
  getPosts,
  getLinks,
  isFollowingUser,
  followUser,
  unfollowUser,
} from "../features/helpers";
import BlogPostThumbnail from "../components/BlogPostThumbnail";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import Profile from "../components/Profile";
import FlagButton from "../components/FlagButton";
import DOMPurify from "dompurify";

function Homepage() {
  const { username } = useParams();
  const currentUserInfo = useRouteLoaderData("root");
  const [userInfo, setUserInfo] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [links, setLinks] = useState([]);
  const [doesUserExist, setDoesUserExist] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // for rendering snackbar
  const [followError, setFollowError] = useState(false);
  const [followSuccess, setFollowSuccess] = useState(false);

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFollowError(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFollowSuccess(false);
  };

  useEffect(() => {
    getUserInfoByUsername(username).then((res) => {
      setUserInfo(res);
      if (res != null) {
        setDoesUserExist(true);
      }
    });
    getPosts(username, "blogPost").then((res) => {
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
          setFollowSuccess(true);
        } else {
          setIsFollowing(false);
          setFollowError(true);
        }
      });
    }
  }

  function unfollowHelper() {
    unfollowUser(username).then((res) => {
      if (res) {
        setIsFollowing(false);
        setFollowSuccess(true);
      } else {
        setIsFollowing(true);
        setFollowError(true);
      }
    });
  }

  if (doesUserExist) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      dateCreated: userInfo["created_date"],
      dateModified: userInfo["updated_date"],
      mainEntity: {
        "@type": "Person",
        name: DOMPurify.sanitize(
          userInfo["first_name"] + " " + userInfo["last_name"],
        ),
        alternateName: DOMPurify.sanitize(userInfo["username"]),
        description: DOMPurify.sanitize(userInfo["about_me"]),
        image: DOMPurify.sanitize(userInfo["profile_picture"]),
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        ></script>
        <div id="homepage">
          <FlagButton
            type={"user"}
            isFlaggedParam={userInfo["flagged"]}
            content={userInfo}
          />
          <div className="user-box">
            <Profile content={{ user: userInfo }} />
            <button
              type="button"
              onClick={
                isFollowing ? () => unfollowHelper() : () => followHelper()
              }
              id="follow"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="general-info">
            <p>{userInfo["about_me"]}</p>
            <p>{userInfo["technical_info"]}</p>
          </div>
          <div className="extra-info">
            <h2>Links</h2>
            <ul className="links">
              {links === null || links.length === 0 ? (
                <p>This user doesn't have any links!</p>
              ) : (
                links.map((content, index) => (
                  <li key={index}>
                    <a href={content["link"]}>{content["name"]}</a>
                  </li>
                ))
              )}
            </ul>
            <h2>Blog Posts</h2>
            <ul className="feed">
              {blogPosts === null || blogPosts.length === 0 ? (
                <p>There's nothing here!</p>
              ) : (
                blogPosts.map((content, index) => (
                  <BlogPostThumbnail key={index} content={content} />
                ))
              )}
            </ul>
          </div>
          <Snackbar
            open={followError}
            autoHideDuration={5000}
            onClose={handleCloseError}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              variant="filled"
              data-testid="failure-alert"
            >
              Something went wrong!
            </Alert>
          </Snackbar>
          <Snackbar
            open={followSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSuccess}
          >
            <Alert
              data-testid="success-alert"
              onClose={handleCloseSuccess}
              severity="success"
              variant="filled"
            >
              Operation successfull!
            </Alert>
          </Snackbar>
        </div>
      </>
    );
  } else {
    return (
      <CircularProgress
        sx={{
          position: "absolute",
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          margin: "auto",
        }}
      />
    );
  }
}

export default Homepage;
