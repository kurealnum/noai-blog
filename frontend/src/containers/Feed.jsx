import { useState } from "react";
import { getFeed } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Paginator from "../components/Paginator";
import FeedComponent from "../components/FeedComponent";

function Feed() {
  // the amount of advertisements to show every x posts: advertise ratio of 5 = 1 ad every 5 posts
  const advertiseRatio = 18;
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["getFeed", page],
    queryFn: () => getFeed(page),
  });

  if (isLoading) {
    return (
      <div id="feed">
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

  if (!data || data.length === 0) {
    return (
      <>
        <ul className="feed">
          <h1>There were no posts to be shown!</h1>
        </ul>
        <Paginator page={page} setPage={setPage} />
      </>
    );
  }
  return (
    <FeedComponent
      data={data}
      advertiseRatio={advertiseRatio}
      type={"standard"}
      showPaginator={true}
      page={page}
      setPage={setPage}
    />
  );
}

export default Feed;
