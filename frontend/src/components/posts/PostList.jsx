import DashboardPostThumbnail from "../DashboardPostThumbnail";

function PostList({ query, type }) {
  if (query.isError || query.data === null) {
    return (
      <p>
        There was an error fetching data{" "}
        {query.error == null ? null : ": " + query.error.message}
      </p>
    );
  } else if (query.data.length == null) {
    return <p>There's nothing here. Go make some posts!</p>;
  } else {
    return (
      <ul className="list">
        {query.data.map((content, index) => (
          <DashboardPostThumbnail
            key={index}
            content={content}
            refetch={query.refetch}
            type={type}
          />
        ))}
      </ul>
    );
  }
}

export default PostList;
