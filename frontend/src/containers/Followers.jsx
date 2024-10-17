import { useQuery } from "@tanstack/react-query";
import { getFollowers } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import Profile from "../components/Profile";

function Followers() {
  const getFollowersQuery = useQuery({
    queryFn: getFollowers,
    queryKey: ["getFollowers"],
  });

  if (getFollowersQuery.isError) {
    return (
      <div id="error-page">
        <h1>There was an error!</h1>
        <p>{getFollowersQuery.error}</p>
      </div>
    );
  }

  if (getFollowersQuery.isLoading) {
    return (
      <div className="default-page">
        <CircularProgress />
      </div>
    );
  }

  if (getFollowersQuery.isSuccess) {
    return (
      <>
        <h1>Followers</h1>
        <ul className="follow-list">
          {getFollowersQuery.data.map((content, index) => (
            <Profile content={content} key={index} />
          ))}
        </ul>
      </>
    );
  }
}

export default Followers;
