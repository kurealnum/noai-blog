import { useState } from "react";
import { getFeed } from "../features/helpers";
import BlogPostThumbnail from "../components/BlogPostThumbnail";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

function Feed() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["getFeed", page],
    queryFn: () => getFeed(page),
  });

  function formSubmitHelper(e) {
    e.preventDefault();
    setPage(e.target.elements.page.value);
  }

  if (isLoading) {
    return (
      <div id="feed">
        <CircularProgress />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div id="feed">
        <h1>There were no posts to be shown!</h1>
        <Paginator
          formSubmitHelper={formSubmitHelper}
          page={page}
          setPage={setPage}
        />
      </div>
    );
  }
  return (
    <div id="feed">
      {data.map((content, index) => (
        <BlogPostThumbnail
          key={index}
          title={content.title}
          username={content.user.username}
          createdDate={content.created_date}
          content={content.content}
        />
      ))}
      <Paginator formSubmitHelper={formSubmitHelper} page={page} />
    </div>
  );
}

function Paginator({ formSubmitHelper, page }) {
  return (
    <form
      aria-label="Select a page"
      className="paginator"
      onSubmit={(e) => formSubmitHelper(e)}
    >
      <label htmlFor="page" hidden>
        Page Number
      </label>
      <input defaultValue={page} type="number" id="page" name="page"></input>
      <button type="submit">Go</button>
    </form>
  );
}

export default Feed;
