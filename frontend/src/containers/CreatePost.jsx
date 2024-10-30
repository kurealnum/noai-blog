import SimpleMdeReact from "react-simplemde-editor";
import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPost, slugify } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import { Navigate, useRouteLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import "../styles/EasyMDE.css";
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import "highlight.js/styles/atom-one-dark.css";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

function CreatePost() {
  // title and content
  const [newBlogPost, setNewBlogPost] = useState({
    content: "Write your blog post here!",
    title: "Default Title",
  });
  const [thumbnail, setThumbnail] = useState({});

  const userData = useRouteLoaderData("root");
  const createPostMutation = useMutation({ mutationFn: createPost });

  // autosave feature
  const autosavedValue =
    localStorage.getItem(`smde_autosavepost`) || "Write your blog post here!";
  const delay = 1000;
  const customRendererOptions = useMemo(() => {
    return {
      autosave: {
        enabled: true,
        uniqueId: "autosavepost",
        delay,
      },
      previewRender(text) {
        return DOMPurify.sanitize(marked.parse(text));
      },
    };
  }, []);

  function handleSave(e) {
    e.preventDefault(e);
    createPostMutation.mutate({ newBlogPost, thumbnail });
  }

  function setContentHelper(content) {
    setNewBlogPost({ ...newBlogPost, content: content });
  }

  function setFormHelper(e, isImage) {
    if (isImage) {
      setThumbnail({ [e.target.name]: e.target.files[0] });
    }
    setNewBlogPost({ ...newBlogPost, [e.target.name]: e.target.value });
  }

  if (createPostMutation.isPending) {
    return <CircularProgress />;
  } else if (createPostMutation.isSuccess) {
    return (
      <Navigate
        to={
          "/post/" + userData["username"] + "/" + slugify(newBlogPost["title"])
        }
      />
    );
  }
  return (
    <div id="create-post">
      <form
        aria-label="Image and title input"
        encType="multipart/form-data"
        method="POST"
        onSubmit={(e) => handleSave(e)}
      >
        <label htmlFor="thumbnail" hidden>
          Thumbnail
        </label>
        <input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setFormHelper(e, true)}
        />
        <label htmlFor="title" hidden>
          Title
        </label>
        <input id="title" name="title" onChange={(e) => setFormHelper(e)} />
        <SimpleMdeReact
          options={customRendererOptions}
          onChange={setContentHelper}
          value={autosavedValue}
        />
        <button
          data-testid="submit-button"
          className="save-button"
          type="submit"
        >
          Publish
        </button>
      </form>
      {createPostMutation.isError ? (
        <div id="error-page">
          <h1>There was an error!</h1>
          <p>{createPostMutation.error.message}</p>
        </div>
      ) : null}
    </div>
  );
}

export default CreatePost;
