import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);
  const [postReplies, setPostReplies] = useState([]);

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
    <div id="dashboard">
      <section className="list-section">
        {" "}
        <h1>Your replies to comments</h1>
        <div className="list">
          {commentReplies.length == 0 ? (
            <p>There's nothing here. Go make some comments!</p>
          ) : (
            commentReplies.map((content, index) => (
              <h2 key={index}>{content.content}</h2>
            ))
          )}
        </div>
      </section>
      <section className="list-section">
        <h1>Your replies to posts</h1>
        <div className="list">
          {postReplies.length == 0 ? (
            <p>There's nothing here. Go read some posts!</p>
          ) : (
            postReplies.map((content, index) => (
              <h2 key={index}>{content.content}</h2>
            ))
          )}
        </div>
      </section>

      <section className="list-section">
        {" "}
        <h1>Your posts</h1>
        <div className="list">
          {posts.length == 0 ? (
            <p>There's nothing here. Go make some posts!</p>
          ) : (
            posts.map((content, index) => <h2 key={index}>{content.title}</h2>)
          )}
        </div>
      </section>
    </div>
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
