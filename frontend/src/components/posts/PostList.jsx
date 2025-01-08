import { useNavigate } from "react-router-dom";
import DashboardPostThumbnail from "../DashboardBlogPostThumbnail";

function PostList({ query, type }) {
  const navigate = useNavigate();

  function editHelper(slug) {
    navigate("/edit-post/" + slug);
  }

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
            title={content.title}
            username={content.user.username}
            createdDate={content.created_date}
            content={content.content}
            editHelper={editHelper}
            refetch={query.refetch}
            type={type}
          />
        ))}
      </ul>
    );
  }
}

export default PostList;
