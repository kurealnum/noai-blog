import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogPost } from "../features/containerHelpers";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function BlogPost() {
  const { username, slug } = useParams();
  const [blogPost, setBlogPost] = useState();

  useEffect(() => {
    getBlogPost({ username, slug }).then((res) => {
      setBlogPost(res);
    });
  }, [username, slug]);

  if (blogPost) {
    return (
      <div id="blog-post">
        <h1>{blogPost.title}</h1>
        <div className="info-bar">
          <div className="username-box">
            <img src={blogPost["user"]["profile_picture"]}></img>
            <span>{blogPost["user"]["username"]}</span>
          </div>
          <div className="likes">
            <span>{blogPost["likes"]}</span>
            <FavoriteBorderIcon />
          </div>
          <div className="date">
            <CalendarMonthIcon />
            <span>{blogPost["created_date"].replace(/(T.*)/g, "")}</span>
          </div>
          <p>{blogPost["content"]}</p>
        </div>
      </div>
    );
  }
  return <p>Loading</p>;
}

export default BlogPost;
