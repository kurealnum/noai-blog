import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogPost } from "../features/containerHelpers";

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
        <div className="info-bar"></div>
      </div>
    );
  }
  return <p>Loading</p>;
}

export default BlogPost;
