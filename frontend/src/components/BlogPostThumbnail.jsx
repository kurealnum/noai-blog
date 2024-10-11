import { Link } from "react-router-dom";
import { slugify } from "../features/helpers";

function BlogPostThumbnail({ title, username, createdDate, content }) {
  return (
    <li className="blog-post">
      <Link to={"/post/" + username + "/" + slugify(title) + "/"}>
        <h2>{title}</h2>
      </Link>
      <div className="info">
        <p>{"By " + username}</p>
        <p>{createdDate.replace(/(T.*)/g, "")}</p>
      </div>
      <p className="hint" data-testid="post-content">
        {content.length > 100 ? content.slice(0, 101) + "..." : content}
      </p>
    </li>
  );
}

export default BlogPostThumbnail;
