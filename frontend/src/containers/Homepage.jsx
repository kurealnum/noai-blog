import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Homepage() {
  const [userInfo, setUserInfo] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [doesUserExist, setDoesUserExist] = useState(false);
  const { username } = useParams();

  useEffect(() => {
    getUserInfo(username, setDoesUserExist).then((res) => {
      setUserInfo(res);
    });
    getBlogPosts(username).then((res) => {
      setBlogPosts(res);
    });
  }, [username]);

  if (doesUserExist) {
    return <p>{username}</p>;
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
