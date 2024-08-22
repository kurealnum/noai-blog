import { useEffect, useState } from "react";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);
  const [postReplies, setPostReplies] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    getPosts().then((res) => {
      setPosts(res);
    });
    getCommentReplies().then((res) => {
      setCommentReplies(res);
    });
    getPostReplies().then((res) => {
      setPostReplies(res);
    });
    getUserInfo().then((res) => {
      setUserInfo(res);
    });
  }, []);

  return (
    <>
      <div className="posts">
        {posts.map((content) => (
          <>
            <h1>Blog posts</h1>
            <h2>{content.title}</h2>
          </>
        ))}
      </div>
    </>
  );
}

async function getPosts() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-posts/", config);
  return await response.json();
}

async function getCommentReplies() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-comment-replies/", config);
  return await response.json();
}

async function getPostReplies() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-post-replies/", config);
  return await response.json();
}

async function getUserInfo() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/accounts/user-info/", config);
  return await response.json();
}

export default Dashboard;
