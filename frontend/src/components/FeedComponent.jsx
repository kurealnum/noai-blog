import Paginator from "./Paginator";
import SearchBar from "../components/SearchBar";
import BlogPostThumbnail from "../components/BlogPostThumbnail";

// this is the feed *component*. not the feed logic itself
function FeedComponent({
  data,
  advertiseRatio,
  type,
  showPaginator,
  setPage,
  page,
  defaultSearchValue,
}) {
  return (
    <>
      <SearchBar type={type} defaultSearchValue={defaultSearchValue} />
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
