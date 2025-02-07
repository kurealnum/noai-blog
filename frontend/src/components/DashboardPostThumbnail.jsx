import { Delete, Edit } from "@mui/icons-material";
import { deletePost, slugify } from "../features/helpers";
import { Dialog } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import reverseUrl from "../features/reverseUrl";
import ConfirmationModal from "../components/ConfirmationModal.jsx";

function DashboardPostThumbnail({ content, refetch, type }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  function editHelper(slug) {
    let url;
    if (type === "list") {
      url = reverseUrl("f_EDIT_LIST", ["list", slug]);
    } else if (type === "blogPost") {
      url = reverseUrl("f_EDIT_BLOG_POST", ["blog-post", slug]);
    }
    navigate(url);
  }

  function dialogHelper() {
    deletePost(slugify(content["title"]), type).then((res) => {
      if (res) {
        refetch();
      }
      setIsDeleteModalOpen(false);
    });
  }

  function toggleDeleteModal() {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }

  return (
    <li className="blog-post">
      <div className="edit-buttons">
        {" "}
        <button onClick={() => editHelper(slugify(content["title"]))}>
          <Edit />
        </button>
        <button onClick={() => toggleDeleteModal(true)}>
          <Delete />
        </button>
        <ConfirmationModal
          helperFunction={dialogHelper}
          message={"This will delete your post forever! Are you sure?"}
          toggleOpen={toggleDeleteModal}
          isOpen={isDeleteModalOpen}
        />
      </div>

      <Link
        to={
          type == "list"
            ? reverseUrl("f_GET_LIST", [
                content["user"]["username"],
                slugify(content["title"]),
              ])
            : reverseUrl("f_GET_BLOG_POST", [
                content["user"]["username"],
                slugify(content["title"]),
              ])
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

export default DashboardPostThumbnail;
