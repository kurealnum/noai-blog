import { Delete } from "@mui/icons-material";
import { slugify } from "../features/helpers";

function BlogPostThumbnail({
  title,
  username,
  createdDate,
  content,
  deleteHelper,
  index,
}) {
  return (
    <li className="blog-post">
      <a href={"/post/" + username + "/" + slugify(title) + "/"}>
        <h2>{title}</h2>
      </a>
      <div className="info">
        <p>{"By " + username}</p>
        <p>{createdDate.replace(/(T.*)/g, "")}</p>
      </div>
      <p className="hint" data-testid="post-content">
        {content.length > 100 ? content.slice(0, 101) + "..." : content}
      </p>
      {deleteHelper != null ? (
        <button onClick={() => deleteHelper(slugify(title), index)}>
          <Delete />
        </button>
      ) : null}
    </li>
  );
}

export default BlogPostThumbnail;
