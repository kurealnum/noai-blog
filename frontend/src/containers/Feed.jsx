import { useEffect } from "react";
import { useState } from "react";
import { getFeed } from "../features/helpers";
import BlogPostThumbnail from "../components/BlogPostThumbnail";

function Feed() {
  const [posts, setPosts] = useState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getFeed(1).then((res) => {
      setPosts(res);
    });
  }, []);

  function formSubmitHelper(e) {
    e.preventDefault();
    getFeed(page).then((res) => {
      setPosts(res);
    });
  }

  if (!posts || posts.length === 0) {
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
      {posts.map((content, index) => (
        <BlogPostThumbnail
          key={index}
          title={content.title}
          username={content.user.username}
          createdDate={content.created_date}
          content={content.content}
        />
      ))}
      <Paginator
        formSubmitHelper={formSubmitHelper}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

function Paginator({ formSubmitHelper, page, setPage }) {
  return (
    <form
      aria-label="Select a page"
      className="paginator"
      onSubmit={(e) => formSubmitHelper(e)}
    >
      <label htmlFor="page" hidden>
        Page Number
      </label>
      <input
        defaultValue={page}
        type="number"
        id="page"
        onChange={(e) => setPage(e.target.value)}
      ></input>
      <button type="submit">Go</button>
    </form>
  );
}

export default Feed;
