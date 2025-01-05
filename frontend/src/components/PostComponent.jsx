import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import DOMPurify from "dompurify";
import { Link, useParams, useRouteLoaderData } from "react-router-dom";
import {
  createReaction,
  getCommentsByPost,
  deleteReaction,
  getPost,
  getReaction,
  createComment,
  slugify,
  isAuthenticated,
} from "../features/helpers";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useEffect, useState } from "react";
import {
  Favorite,
  FormatAlignCenter,
  FormatAlignLeft,
} from "@mui/icons-material";
import Comments from "../containers/Comments.jsx";
import Profile from "../components/Profile";
import FlagButton from "../components/FlagButton";
import Thumbnail from "../components/Thumbnail";
import "../styles/BlogPost.css";
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import "highlight.js/styles/base16/classic-light.css";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

function PostComponent({ type }) {
  const { username, slug } = useParams();
  const userData = useRouteLoaderData("root");
  const [doesReactionExist, setDoesReactionExist] = useState(false);
  const [isLeftAligned, setIsLeftAligned] = useState(false);

  const { data, isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ["getPost_" + type, username, slug],
    queryFn: () => getPost({ username, slug, type }),
  });
  const getCommentsByPostQuery = useQuery({
    queryKey: ["getCommentsByPost_" + type, username, slug],
    queryFn: () => getCommentsByPost(username, slug, type),
  });

  useEffect(() => {
    getReaction(slug, username, type).then((res) => {
      if (res) {
        setDoesReactionExist(true);
      } else {
        setDoesReactionExist(false);
      }
    });
  }, [slug, username, type]);

  function createReactionHelper() {
    createReaction(slug, username, type).then((res) => {
      if (res) {
        setDoesReactionExist(true);
        refetch();
      } else {
        setDoesReactionExist(false);
      }
    });
  }

  function deleteReactionHelper() {
    deleteReaction(slug, type).then((res) => {
      if (res) {
        setDoesReactionExist(false);
        refetch();
      } else {
        setDoesReactionExist(true);
      }
    });
  }

  function createCommentHelper(e) {
    e.preventDefault();
    createComment(slug, e.target[0].value, "", type).then((res) => {
      if (res) {
        getCommentsByPostQuery.refetch();
        e.target[0].value = "";
      }
    });
  }

  if (isLoading) {
    return (
      <div id="blog-post" className="centered-page">
        <CircularProgress
          sx={{
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
            margin: "auto",
          }}
        />
        ;
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
    document.title = document.title + " - " + data["title"];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: DOMPurify.sanitize(data["title"]),
      image: [data["thumbnail"]],
      datePublished: DOMPurify.sanitize(data["created_date"]),
      dateModified: DOMPurify.sanitize(data["updated_date"]),
      author: [
        {
          "@type": "Person",
          name: DOMPurify.sanitize(data["user"]["username"]),
          url: "/homepage/" + DOMPurify.sanitize(data["user"]["username"]),
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        ></script>
        <div id="blog-post">
          <div className="blogpost-thumbnail-wrapper">
            <Thumbnail url={data["thumbnail"]} />
          </div>
          <h1>{data.title}</h1>
          <div className="info-bar">
            <div className="info-bar-box">
              <Profile content={data} />
            </div>
            <button
              className="reaction-button"
              data-testid="reaction-button-icon"
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
            <button
              className="reaction-button"
              onClick={() => setIsLeftAligned(!isLeftAligned)}
            >
              {isLeftAligned ? <FormatAlignCenter /> : <FormatAlignLeft />}
            </button>
            <FlagButton
              type={"post"}
              isFlaggedParam={data["flagged"]}
              content={{
                username: data["user"]["username"],
                slug: slugify(data["title"]),
              }}
            />
            {userData["username"] === username ? (
              <Link className="text-box" to={"/edit-post/" + slug}>
                <p>Edit</p>
              </Link>
            ) : null}
          </div>
          <div
            className={
              isLeftAligned
                ? "blog-post-content-align-left"
                : "blog-post-content-align-center"
            }
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(data["content"])),
            }}
          ></div>
          <div>
            <h2>Comments</h2>
            {isAuthenticated() ? (
              <form
                onSubmit={(e) => createCommentHelper(e)}
                className="create-comment-form"
              >
                <textarea></textarea>
                <button type="submit">Comment</button>
              </form>
            ) : null}
            {getCommentsByPostQuery.isSuccess ? (
              <Comments
                raw={getCommentsByPostQuery.data}
                refetch={getCommentsByPostQuery.refetch}
              />
            ) : (
              <h3>There was an error fetching the comments!</h3>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default PostComponent;
