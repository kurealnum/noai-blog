import SimpleMdeReact from "react-simplemde-editor";
import { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editPost, getPost, slugify } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import { Navigate, useParams, useRouteLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import "../styles/EasyMDE.css";
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import "highlight.js/styles/atom-one-dark.css";
import reverseUrl from "../features/reverseUrl";
import { useDispatch } from "react-redux";
import { checkPostType } from "../features/authStore/authSlice";
import { TYPE_BLOG_POST, TYPE_LIST } from "../features/types";
import "../styles/CreatePost.css";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

function EditPost() {
  // Init data
  const userData = useRouteLoaderData("root");
  const { type, slug } = useParams();
  const [newBlogPost, setNewBlogPost] = useState({});
  const [crosspostURL, setCrosspostURL] = useState("");
  const [thumbnail, setThumbnail] = useState({});
  const dispatch = useDispatch();

  if (type === "list") {
    dispatch(checkPostType(TYPE_LIST));
  } else if (type === "blog-post") {
    dispatch(checkPostType(TYPE_BLOG_POST));
  }

  // Querys/mutations
  const toEditBlogPostQuery = useQuery({
    queryFn: () => getPost(userData["username"], slug),
    queryKey: [
      "toEditBlogPost",
      { username: userData["username"], slug: slug, type: type },
    ],
    retry: false,
  });
  const editPostMutation = useMutation({ mutationFn: editPost });

  useEffect(() => {
    if (toEditBlogPostQuery.isSuccess) {
      setNewBlogPost({ ...toEditBlogPostQuery.data, slug: slug });
      if (toEditBlogPostQuery.data["crosspost"] != undefined) {
        setCrosspostURL(
          DOMPurify.sanitize(toEditBlogPostQuery.data["crosspost"]["url"]),
        );
      }
    }
  }, [slug, toEditBlogPostQuery.data, toEditBlogPostQuery.isSuccess]);

  // Autosave Logic
  const delay = 1000;
  const customRendererOptions = useMemo(() => {
    return {
      autosave: {
        enabled: true,
        uniqueId: "autosaveeditedpost",
        delay,
      },
      previewRender(text) {
        return DOMPurify.sanitize(marked.parse(text));
      },
    };
  }, []);

  // Helper Functions
  function handleSave(e) {
    e.preventDefault();
    editPostMutation.mutate({
      newBlogPost,
      thumbnail,
      originalSlug: slug,
      crosspostURL: crosspostURL,
    });
  }

  function setContentHelper(content) {
    setNewBlogPost({ ...newBlogPost, content: content });
  }

  function setFormHelper(e) {
    setNewBlogPost({ ...newBlogPost, [e.target.name]: e.target.value });
  }

  function setThumbnailHelper(e) {
    setThumbnail({ [e.target.name]: e.target.files[0] });
  }

  // why we have to do this... is beyond me.
  function getCrosspostURL() {
    if (crosspostURL != null) {
      return crosspostURL;
    } else {
      return "";
    }
  }

  // Rendering Logic
  if (toEditBlogPostQuery.isError) {
    return <Navigate to={"/dashboard/"} />;
  } else if (toEditBlogPostQuery.isPending) {
    <CircularProgress
      sx={{
        position: "absolute",
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
        margin: "auto",
      }}
    />;
  }

  if (editPostMutation.isPending) {
    return (
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
    );
  } else if (editPostMutation.isSuccess) {
    let url;
    if (type === "list") {
      url = reverseUrl("f_GET_LIST", [
        userData["username"],
        slugify(newBlogPost["title"]),
      ]);
    } else if (type === "blog-post") {
      url = reverseUrl("f_GET_BLOG_POST", [
        userData["username"],
        slugify(newBlogPost["title"]),
      ]);
    }
    return <Navigate to={url} />;
  }

  return (
    <div id="create-post">
      <form
        className="post-form"
        aria-label="Image and title input"
        encType="multipart/form-data"
        method="POST"
        onSubmit={(e) => handleSave(e)}
      >
        <div className="flex-row-spacing">
          <label htmlFor="thumbnail" hidden>
            Thumbnail
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => setThumbnailHelper(e, true)}
          />
          {getCrosspostURL() != "" ? (
            <>
              <label htmlFor="url" hidden>
                URL for crosspost
              </label>
              <input
                id="url"
                name="url"
                className="generic-input"
                onChange={(e) => setFormHelper(e)}
                defaultValue={getCrosspostURL()}
              ></input>
            </>
          ) : null}
          <label htmlFor="title" hidden>
            Title
          </label>
          <label htmlFor="title" hidden>
            Title
          </label>
          <input
            id="title"
            name="title"
            onChange={(e) => setFormHelper(e)}
            defaultValue={newBlogPost["title"]}
          />
        </div>
        <div className="simplemde-wrapper">
          <SimpleMdeReact
            options={customRendererOptions}
            onChange={setContentHelper}
            value={newBlogPost["content"]}
          />
        </div>
        <button
          data-testid="submit-button"
          className="save-button"
          type="submit"
        >
          Save
        </button>
      </form>
      {editPostMutation.isError ? (
        <div id="error-page">
          <h1>There was an error!</h1>
          <p>{editPostMutation.error.message}</p>
        </div>
      ) : null}
    </div>
  );
}

export default EditPost;
