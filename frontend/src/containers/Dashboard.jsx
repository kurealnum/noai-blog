import { useEffect, useState } from "react";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts().then((res) => {
      console.log(res);
      setPosts(res);
    });
  }, []);
  return (
    <div className="posts">
      {posts.map((content) => (
        <h2>{content.title}</h2>
      ))}
    </div>
  );
}

async function getPosts() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-posts/", config);
  return await response.json();
}

export default Dashboard;
