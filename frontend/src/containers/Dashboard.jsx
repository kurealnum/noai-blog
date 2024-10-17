import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import {
  deletePost,
  getBlogPosts,
  getComments,
  limitLength,
} from "../features/helpers";
import DashboardBlogPostThumbnail from "../components/DashboardBlogPostThumbnail";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBlogPosts().then((res) => {
      setPosts(res);
    });
    getComments().then((res) => {
      setComments(res);
    });
  }, []);

  function deleteHelper(slug, index) {
    deletePost(slug).then((res) => {
      if (res) {
        const newPosts = posts.slice(0, index).concat(posts.slice(index + 1));
        setPosts(newPosts);
        return res;
      }
      return res;
    });
  }

  function editHelper(slug) {
    navigate("/edit-post/" + slug);
  }

  return (
    <div id="dashboard">
      <section className="flex-row-spacing vertical-margin-50">
        <Link to="/followers" className="link-button">
          View followers
        </Link>
        <Link to="/following" className="link-button">
          View following
        </Link>
      </section>
      <section className="list-section">
        <h1>Your comments</h1>
        <ul className="list">
          {comments === null || comments.length === 0 ? (
            <p role="progressbar">
              There's nothing here. Go make some comments!
            </p>
          ) : (
            comments.map((content, index) => (
              <li className="comment" key={index}>
                <p data-testid="comment-content">
                  {limitLength(content["content"])}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="list-section">
        {" "}
        <h1>Your posts</h1>
        <ul className="list">
          {posts.length === null || posts.length === 0 ? (
            <p role="progressbar">There's nothing here. Go make some posts!</p>
          ) : (
            posts.map((content, index) => (
              <DashboardBlogPostThumbnail
                key={index}
                title={content.title}
                username={content.user.username}
                createdDate={content.created_date}
                content={content.content}
                deleteHelper={deleteHelper}
                editHelper={editHelper}
                index={index}
              />
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
