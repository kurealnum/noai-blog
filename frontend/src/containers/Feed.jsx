import { useState } from "react";
import { getFeed } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FeedComponent from "../components/FeedComponent";

function Feed() {
  const advertiseRatio = 18;
  return (
    <FeedComponent
      advertiseRatio={advertiseRatio}
      type={"posts"}
      showPaginator={true}
      defaultSearchValue={""}
      queryFunction={getFeed}
      includePage={true}
    />
  );
}

export default Feed;
