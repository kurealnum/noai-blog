import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);
  const [postReplies, setPostReplies] = useState([]);
  const userData = useLoaderData();
  console.log(userData);

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
  }, []);

  return (
    <>
      <section className="list-section">
        {" "}
        <h1>Your replies to comments</h1>
        <div className="list">
          {commentReplies.map((content, index) => (
            <h2 key={index}>{content.content}</h2>
          ))}
        </div>
        <h1>Your replies to posts</h1>
        <div className="list">
          {postReplies.map((content, index) => (
            <h2 key={index}>{content.content}</h2>
          ))}
        </div>
      </section>

      <section className="list-section">
        {" "}
        <h1>Your posts</h1>
        <div className="list">
          {posts.map((content, index) => (
            <h2 key={index}>{content.title}</h2>
          ))}
        </div>
      </section>
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

export default Dashboard;
