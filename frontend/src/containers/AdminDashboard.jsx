import { useQueries } from "@tanstack/react-query";
import {
  getFlaggedComments,
  getFlaggedPosts,
  getFlaggedUsers,
} from "../features/helpers";
import { CircularProgress } from "@mui/material";
import BlogPostThumbnail from "../components/BlogPostThumbnail";
import Comment from "../components/Comment";
import Profile from "../components/Profile";

function AdminDashboard() {
  const flaggedQueries = useQueries({
    queries: [
      {
        queryKey: ["flaggedPosts"],
        queryFn: getFlaggedPosts,
      },
      {
        queryKey: ["flaggedComments"],
        queryFn: getFlaggedComments,
      },
      {
        queryKey: ["flaggedUsers"],
        queryFn: getFlaggedUsers,
      },
    ],
  });

  if (
    flaggedQueries.every((query) => {
      return query.isLoading;
    })
  ) {
    <CircularProgress
      sx={{
        position: "absolute",
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
        margin: "auto",
      }}
    />;
  } else if (
    flaggedQueries.every((query) => {
      return query.isError;
    })
  ) {
    return (
      <div id="error-page">
        {flaggedQueries.map((content, index) => {
          <h1 key={index}>{content.error}</h1>;
        })}
      </div>
    );
  } else if (
    flaggedQueries.every((query) => {
      return query.isSuccess;
    })
  ) {
    return (
      <div className="flex-row-spacing">
        <ul id="flagged-posts">
          {flaggedQueries[0].data.map((content, index) => (
            <BlogPostThumbnail
              content={content}
              key={index}
              isAdminDashboard={true}
              refetch={flaggedQueries[0].refetch}
            />
          ))}
        </ul>
        <ul id="flagged-comments">
          {flaggedQueries[1].data.map((content, index) => (
            <Comment
              content={content}
              key={index}
              isAdminDashboard={true}
              refetch={flaggedQueries[1].refetch}
            />
          ))}
        </ul>
        <ul id="flagged-users">
          {flaggedQueries[2].data.map((content, index) => (
            <Profile
              content={{ user: content }}
              key={index}
              isAdminDashboard={true}
              refetch={flaggedQueries[2].refetch}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default AdminDashboard;
