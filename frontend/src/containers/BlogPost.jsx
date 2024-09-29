import { useParams } from "react-router-dom";
import { getBlogPost } from "../features/helpers";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "../styles/BlogPost.css";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { marked } from "marked";
import DOMPurify from "dompurify";

function BlogPost() {
  const { username, slug } = useParams();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["getBlogPost", username, slug],
    queryFn: () => getBlogPost({ username, slug }),
  });

  if (isLoading) {
    return (
      <div id="blog-post" className="centered-page">
        <CircularProgress />
      </div>
    );
  }

  if (isSuccess) {
    document.title = "NoAI Blog" + " - " + data["title"];
  }

  return (
    <div id="blog-post">
      <h1>{data.title}</h1>
      <div className="info-bar">
        <div className="info-bar-box">
          <div className="username-box username-box-no-change">
            <img id="pfp" src={data["user"]["profile_picture"]}></img>
            <span>By {data["user"]["username"]}</span>
          </div>
          <div className="likes">
            <span>{data["likes"] == null ? 0 : data["likes"]}</span>
            <FavoriteBorderIcon />
          </div>
        </div>
        <div id="member-since">
          <CalendarMonthIcon />
          <span>{data["created_date"].replace(/(T.*)/g, "")}</span>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked.parse(data["content"])),
        }}
      ></div>
    </div>
  );
}

export default BlogPost;
