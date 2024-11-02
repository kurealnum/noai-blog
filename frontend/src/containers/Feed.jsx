import { useState } from "react";
import { getFeed } from "../features/helpers";
import BlogPostThumbnail from "../components/BlogPostThumbnail";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

function Feed() {
  // the amount of advertisements to show every x posts: advertise ratio of 5 = 1 ad every 5 posts
  const advertiseRatio = 18;
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
      <>
        <ul className="feed">
          <h1>There were no posts to be shown!</h1>
        </ul>
        <Paginator
          formSubmitHelper={formSubmitHelper}
          page={page}
          setPage={setPage}
        />
      </>
    );
  }
  return (
    <>
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
      <Paginator formSubmitHelper={formSubmitHelper} page={page} />
    </>
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
