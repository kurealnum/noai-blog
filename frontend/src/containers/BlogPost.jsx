import { useParams } from "react-router-dom";
import {
  createReaction,
  deleteReaction,
  doesPathExist,
  getBlogPost,
  getReaction,
} from "../features/helpers";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "../styles/BlogPost.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import "highlight.js/styles/base16/classic-light.css";
import { useEffect, useState } from "react";
import { Favorite } from "@mui/icons-material";

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
  const [doesReactionExist, setDoesReactionExist] = useState(false);
  const { data, isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ["getBlogPost", username, slug],
    queryFn: () => getBlogPost({ username, slug }),
  });
  const [doesExist, setDoesExist] = useState(false);

  useEffect(() => {
    getReaction(slug).then((res) => {
      if (res) {
        setDoesReactionExist(true);
      } else {
        setDoesReactionExist(false);
      }
    });
  }, [slug]);

  function createReactionHelper() {
    createReaction(slug).then((res) => {
      if (res) {
        setDoesReactionExist(true);
        refetch();
      } else {
        setDoesReactionExist(false);
      }
    });
  }

  function deleteReactionHelper() {
    deleteReaction(slug).then((res) => {
      if (res) {
        setDoesReactionExist(false);
        refetch();
      } else {
        setDoesReactionExist(true);
      }
    });
  }

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

    doesPathExist(data["user"]["profile_picture"]).then((res) => {
      if (res) {
        setDoesExist(true);
      } else {
        setDoesExist(false);
      }
    });

    return (
      <div id="blog-post">
        <h1>{data.title}</h1>
        <div className="info-bar">
          <div className="info-bar-box">
            <div className="username-box username-box-no-change">
              {doesExist ? (
                <img id="pfp" src={data["user"]["profile_picture"]}></img>
              ) : null}
              <span>By {data["user"]["username"]}</span>
            </div>
          </div>
          <button
            data-testid="reaction-button"
            onClick={
              doesReactionExist
                ? () => deleteReactionHelper()
                : () => createReactionHelper()
            }
          >
            <div className="likes">
              <span data-testid="reaction-count">
                {data["likes"] == null ? 0 : data["likes"]}
              </span>
              {doesReactionExist ? <Favorite /> : <FavoriteBorderIcon />}
            </div>
          </button>

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
