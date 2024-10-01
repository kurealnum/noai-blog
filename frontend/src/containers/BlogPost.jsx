import { useParams } from "react-router-dom";
import { doesPathExist, getBlogPost } from "../features/helpers";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "../styles/BlogPost.css";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import "highlight.js/styles/base16/classic-light.css";
import { useEffect, useState } from "react";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

function BlogPost() {
  const { username, slug } = useParams();
  const { data, isLoading, isSuccess, isError, error } = useQuery({
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

  if (isError) {
    return (
      <div id="error-page">
        <h1>{error.message}</h1>
      </div>
    );
  }

  if (isSuccess) {
    document.title = "NoAI Blog" + " - " + data["title"];

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
}

export default BlogPost;
