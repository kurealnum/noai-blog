import Paginator from "./Paginator";
import SearchBar from "../components/SearchBar";
import BlogPostThumbnail from "../components/BlogPostThumbnail";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { getPostType } from "../features/helpers";
import { useDispatch } from "react-redux";
import { checkPostType } from "../features/authStore/authSlice";

// this is the feed *component*. not the feed logic itself
function FeedComponent({
  args,
  advertiseRatio,
  showPaginator,
  defaultSearchValue,
  queryFunction,
  includePage,
  // typeSet literally exists for the sole purpose of setting the type "of post" in the feed
  typeSet,
}) {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  dispatch(checkPostType(typeSet));

  const type = getPostType();

  if (args == undefined) {
    args = [];
  }

  if (includePage === true) {
    args = [...args, page];
  }

  const { data, isLoading } = useQuery({
    queryKey: [type + "feed", page, ...args],
    queryFn: () => queryFunction(...args),
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
    <>
      <SearchBar defaultSearchValue={defaultSearchValue} />
      <ul className="feed">
        {data.map((content, index) => (
          <>
            <BlogPostThumbnail key={index} content={content} />
            {(index + 1) % advertiseRatio == 0 ? (
              <div
                className="feed-advertisement"
                key={"feed-advertisement" + index}
              >
                <a
                  href="mailto: thenoaiblog@gmail.com"
                  key={"feed-advertisement" + index}
                >
                  Contact us about advertisements!
                </a>
              </div>
            ) : null}
          </>
        ))}
      </ul>
      {showPaginator ? <Paginator page={page} setPage={setPage} /> : null}
    </>
  );
}

export default FeedComponent;
