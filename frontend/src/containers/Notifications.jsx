import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import CommentThumbnail from "../components/CommentThumbnail";

function Notifications() {
  const { data, error, isLoading, isSuccess, isError } = useQuery({
    queryFn: () => getNotifications(),
    queryKey: ["getNotifications"],
  });

  if (isError) {
    return (
      <>
        <h1>There was an error!</h1>
        <p>{error.message}</p>
      </>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isSuccess) {
    return data.map((content, index) => (
      <CommentThumbnail key={index} content={content} />
    ));
  }
}

export default Notifications;
