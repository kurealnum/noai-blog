import "../styles/Dashboard.css";
import { getPosts } from "../features/helpers";
import { Link, useRouteLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "../components/LoadingIcon.jsx";
import PostList from "../components/posts/PostList.jsx";

function Dashboard() {
  const userData = useRouteLoaderData("root");

  const blogPostQuery = useQuery({
    queryKey: ["getBlogPosts"],
    queryFn: () => getPosts(userData["username"], "blogPost"),
    enabled: !!userData["username"],
  });
  const listsQuery = useQuery({
    queryKey: ["getLists"],
    queryFn: () => getPosts(userData["username"], "list"),
    enabled: !!userData["username"],
  });

  if (blogPostQuery.isLoading || listsQuery.isLoading) {
    return <LoadingIcon />;
  } else if (blogPostQuery.isError && listsQuery.isError) {
    return (
      <div id="error-page">
        <h1>There was an error rendering your dashboard!</h1>
        <p>{blogPostQuery.error.message}</p>
        <p>{listsQuery.error.message}</p>
      </div>
    );
  } else if (blogPostQuery.isSuccess || listsQuery.isSuccess) {
    return (
      <div id="dashboard">
        <section className="flex-row-spacing vertical-margin-50">
          <Link to="/followers" className="link-button">
            View followers
          </Link>
          <Link to="/following" className="link-button">
            View following
          </Link>
        </section>
        <section className="list-section">
          <h1>Your posts</h1>
          <PostList query={blogPostQuery} type={"blogPost"} />
          <h1>Your lists</h1>
          <PostList query={listsQuery} type={"list"} />
        </section>
      </div>
    );
  }
}

export default Dashboard;
