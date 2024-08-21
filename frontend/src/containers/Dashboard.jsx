import { useEffect, useState } from "react";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts("ADMIN").then((res) => {
      console.log(res);
      setPosts(res);
    });
  }, []);
  return (
    <div className="posts">
      {posts.map((content) => (
        <p>{content}</p>
      ))}
    </div>
  );
}

async function getPosts(username) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-posts/" + username, config);
  return await response.json();
}

export default Dashboard;
