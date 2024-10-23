import { Link } from "react-router-dom";
import { isAdmin, slugify, toggleListicle } from "../features/helpers";
import FlagButton from "./FlagButton";
import { useMutation } from "@tanstack/react-query";
import { PlaylistAdd, PlaylistRemove } from "@mui/icons-material";

function BlogPostThumbnail({ content, isAdminDashboard, refetch }) {
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
      {isAdminDashboard && isAdmin() ? (
        <button onClick={() => toggleListicleMutation.mutate()}>
          {content["is_listicle"] ? <PlaylistRemove /> : <PlaylistAdd />}
        </button>
      ) : null}
    </li>
  );
}

export default BlogPostThumbnail;
