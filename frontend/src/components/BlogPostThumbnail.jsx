import { Link } from "react-router-dom";
import { slugify } from "../features/helpers";
import FlagButton from "./FlagButton";

function BlogPostThumbnail({ content }) {
  return (
    <li className="blog-post">
      <FlagButton
        type={"post"}
        content={{
          username: content["user"]["username"],
          slug: slugify(content["title"]),
        }}
        isFlaggedParam={content["flagged"]}
      />
      <Link
        to={
          "/post/" +
          content["user"]["username"] +
          "/" +
          slugify(content["title"]) +
          "/"
        }
      >
        <h2>{content["title"]}</h2>
      </Link>
      <div className="info">
        <p>{"By " + content["user"]["username"]}</p>
        <p>{content["created_date"].replace(/(T.*)/g, "")}</p>
      </div>
      <p className="hint" data-testid="post-content">
        {content["content"].length > 100
          ? content["content"].slice(0, 101) + "..."
          : content["content"]}
      </p>
    </li>
  );
}

export default BlogPostThumbnail;
