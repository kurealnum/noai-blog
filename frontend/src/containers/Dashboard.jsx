import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getPosts().then((res) => {
      setPosts(res);
    });
    getComments().then((res) => {
      setComments(res);
    });
  }, []);

  return (
    <div id="dashboard">
      <section className="list-section">
        <h1>Your comments</h1>
        <div className="list">
          {comments.length == 0 ? (
            <p>There's nothing here. Go make some comments!</p>
          ) : (
            comments.map((content, index) => (
              <div className="comment" key={index}>
                <p>
                  {content["content"].length > 100
                    ? content["content"].slice(0, 101) + "..."
                    : content.content}
                </p>
              </div>
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
            posts.map((content, index) => (
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

async function getComments() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-comments/", config);
  return await response.json();
}

export default Dashboard;
