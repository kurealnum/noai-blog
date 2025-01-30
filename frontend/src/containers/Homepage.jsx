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
import LoadingIcon from "../components/LoadingIcon.jsx";
import { useQuery } from "@tanstack/react-query";
import LoadingError from "../components/LoadingError.jsx";

function Homepage() {
  const { username } = useParams();
  const currentUserInfo = useRouteLoaderData("root");
  const [isFollowing, setIsFollowing] = useState(false);

  // for rendering snackbar
  const [followError, setFollowError] = useState(false);
  const [followSuccess, setFollowSuccess] = useState(false);

  // querys & mutations
  const blogPostsQuery = useQuery({
    queryKey: ["blogPosts", username],
    queryFn: () => getPosts(username, "blogPost"),
  });
  const listsQuery = useQuery({
    queryKey: ["lists", username],
    queryFn: () => getPosts(username, "list"),
  });
  const userInfoQuery = useQuery({
    queryKey: ["userInfo", username],
    queryFn: () => getUserInfoByUsername(username),
  });
  const linksQuery = useQuery({
    queryKey: ["links", username],
    queryFn: () => getLinks(username),
  });

  // helper functions
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

  // prevents user from following themselves
  function followHelper() {
    if (
      currentUserInfo["username"] != null &&
      currentUserInfo["username"] !== userInfoQuery.data["username"]
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

  useEffect(() => {
    // see comments in helpers.js for this function
    isFollowingUser(username).then((res) => {
      if (!res) {
        setIsFollowing(false);
      } else {
        setIsFollowing(true);
      }
    });
  }, [username]);

  // Only using userInfoQuery to tell if the page is loaded because it's the only thing that the user is gauranteed to "have"
  if (userInfoQuery.isPending) {
    return <LoadingIcon />;
  } else if (userInfoQuery.isSuccess) {
    document.title = "NoAI Blog" + " - " + username;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      dateCreated: userInfoQuery.data["created_date"],
      dateModified: userInfoQuery.data["updated_date"],
      mainEntity: {
        "@type": "Person",
        name: DOMPurify.sanitize(
          userInfoQuery.data["first_name"] +
            " " +
            userInfoQuery.data["last_name"],
        ),
        alternateName: DOMPurify.sanitize(userInfoQuery.data["username"]),
        description: DOMPurify.sanitize(userInfoQuery.data["about_me"]),
        image: DOMPurify.sanitize(userInfoQuery.data["profile_picture"]),
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
            isFlaggedParam={userInfoQuery.data["flagged"]}
            content={userInfoQuery.data}
          />
          <div className="user-box">
            <Profile content={{ user: userInfoQuery.data }} />
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
            <p>{userInfoQuery.data["about_me"]}</p>
            <p>{userInfoQuery.data["technical_info"]}</p>
          </div>
          <div className="extra-info">
            <h2>Links</h2>
            <ul className="links">
              {linksQuery.data === null || linksQuery.data.length === 0 ? (
                <p>This user doesn't have any links!</p>
              ) : (
                linksQuery.data.map((content, index) => (
                  <li key={index}>
                    <a href={DOMPurify.sanitize(content["link"])}>
                      {DOMPurify.sanitize(content["name"])}
                    </a>
                  </li>
                ))
              )}
            </ul>
            <h2>Blog Posts</h2>
            <ul className="feed">
              {blogPostsQuery.isSuccess ? (
                blogPostsQuery.data.map((content, index) => (
                  <BlogPostThumbnail key={index} content={content} />
                ))
              ) : (
                <p>There's nothing here!</p>
              )}
            </ul>
            <h2>Lists</h2>
            <ul className="feed">
              {listsQuery.isSuccess ? (
                listsQuery.data.map((content, index) => (
                  <BlogPostThumbnail key={index} content={content} />
                ))
              ) : (
                <p>There's nothing here!</p>
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
    return <LoadingError />;
  }
}

export default Homepage;
