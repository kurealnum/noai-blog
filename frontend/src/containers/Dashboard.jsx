import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { getBlogPosts, getComments } from "../features/containerHelpers";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getBlogPosts().then((res) => {
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
          {comments === null || comments.length === 0 ? (
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
          {posts.length === null || posts.length === 0 ? (
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

export default Dashboard;
