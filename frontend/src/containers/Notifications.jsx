import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import Comment from "../components/Comment";

function Notifications() {
  const { data, error, isLoading, isSuccess, isError, refetch } = useQuery({
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
    return (
      <div className="default-page" id="notifications">
        <ul className="list">
          {data.map((content, index) => (
            <Comment
              content={content}
              isReply={false}
              key={index}
              isNotification={true}
              refetch={refetch}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default Notifications;
