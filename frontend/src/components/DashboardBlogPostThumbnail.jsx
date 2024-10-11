import { Delete, Edit } from "@mui/icons-material";
import { slugify } from "../features/helpers";
import { Dialog } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

function DashboardBlogPostThumbnail({
  title,
  username,
  createdDate,
  content,
  deleteHelper,
  editHelper,
  index,
}) {
  const [open, setOpen] = useState(false);
  function dialogHelper() {
    const res = deleteHelper(slugify(title), index);
    if (res) {
      setOpen(false);
    }
  }
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
      <button onClick={() => setOpen(true)}>
        <Delete />
        <Dialog open={open}>
          <h1>This will delete your post forever! Are you sure?</h1>
          <button onClick={() => dialogHelper()}>Yes, I am sure</button>
        </Dialog>
      </button>
      <button onClick={() => editHelper(slugify(title))}>
        <Edit />
      </button>
    </li>
  );
}

export default DashboardBlogPostThumbnail;
