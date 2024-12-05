import { useQuery } from "@tanstack/react-query";
import { getFollowing } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import Profile from "../components/Profile";

function Following() {
  const getFollowingQuery = useQuery({
    queryFn: getFollowing,
    queryKey: ["getFollowing"],
  });

  if (getFollowingQuery.isError) {
    return (
      <div id="error-page">
        <h1>There was an error!</h1>
        <p>{getFollowingQuery.error}</p>
      </div>
    );
  }

  if (getFollowingQuery.isLoading) {
    return (
      <div className="default-page">
        <CircularProgress
          sx={{
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
            margin: "auto",
          }}
        />
        ;
      </div>
    );
  }

  if (getFollowingQuery.isSuccess) {
    return (
      <>
        <h1>Following</h1>
        <ul className="follow-list">
          {getFollowingQuery.data.length === 0 ? (
            <h2>You aren't following anyone!</h2>
          ) : (
            getFollowingQuery.data.map((content, index) => (
              <Profile content={content} key={index} />
            ))
          )}
        </ul>
      </>
    );
  }
}

export default Following;
