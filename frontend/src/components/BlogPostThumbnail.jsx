import { Link } from "react-router-dom";
import {
  adminDeletePost,
  isAdmin,
  slugify,
  toggleListicle,
} from "../features/helpers";
import FlagButton from "./FlagButton";
import { useMutation } from "@tanstack/react-query";
import { Delete, PlaylistAdd, PlaylistRemove } from "@mui/icons-material";
import { Dialog } from "@mui/material";
import { useState } from "react";
import Thumbnail from "./Thumbnail";

function BlogPostThumbnail({ content, isAdminDashboard, refetch }) {
  const [open, setOpen] = useState(false);
  const [isImage, setIsImage] = useState(
    content["user"]["profile_picture"] != null,
  );
  function dialogHelper() {
    adminDeletePost(
      content["user"]["username"],
      slugify(content["title"]),
    ).then((res) => {
      if (res) {
        setOpen(false);
        refetch();
      }
    });
  }
  const toggleListicleMutation = useMutation({
    mutationFn: () =>
      toggleListicle(content["user"]["username"], slugify(content["title"])),
    onSuccess: (data, variables, context) => {
      refetch();
    },
  });

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
        <Thumbnail url={content["thumbnail"]} />
        <h2>{content["title"]}</h2>
        <div className="info">
          <div className="info-user-box">
            {isImage ? (
              <img
                src={content["user"]["profile_picture"]}
                onError={() => setIsImage(false)}
              />
            ) : null}
            <p>{content["user"]["username"]}</p>{" "}
          </div>
          <p>{content["created_date"].replace(/(T.*)/g, "")}</p>
        </div>
        {isAdminDashboard && isAdmin() ? (
          <div className="flex-row-spacing">
            <button onClick={() => toggleListicleMutation.mutate()}>
              {content["is_listicle"] ? <PlaylistRemove /> : <PlaylistAdd />}
            </button>
            <button onClick={() => setOpen(true)}>
              <Delete />
            </button>
            <Dialog
              open={open}
              className="delete-post-confirm"
              onClose={() => setOpen(false)}
            >
              <h1>
                This will delete SOMEONE ELSE'S POST FOREVER as well as ALL OF
                THE COMMENTS!!! Are you sure?
              </h1>
              <button onClick={() => dialogHelper()} className="accent-border">
                Yes, I am sure
              </button>
              <button
                onClick={() => setOpen(false)}
                className="tertiary-border"
              >
                No, I'm not
              </button>
            </Dialog>
          </div>
        ) : null}
      </Link>
    </li>
  );
}

export default BlogPostThumbnail;
