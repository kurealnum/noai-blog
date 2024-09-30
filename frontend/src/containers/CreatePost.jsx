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

function CreatePost() {
  // title and content
  const [newBlogPost, setNewBlogPost] = useState({
    content: "Write your blog post here!",
    title: "Default Title",
  });
  const userData = useRouteLoaderData("root");
  const createPostMutation = useMutation({ mutationFn: createPost });

  const customRendererOptions = useMemo(() => {
    return {
      previewRender(text) {
        return DOMPurify.sanitize(marked.parse(text));
      },
    };
  }, []);

  function handleSave() {
    createPostMutation.mutate(newBlogPost);
  }

  function setContentHelper(content) {
    setNewBlogPost({ ...newBlogPost, content: content });
  }

  function setTitleHelper(e) {
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
      <form aria-label="Title input">
        <label htmlFor="title" hidden>
          Title
        </label>
        <input id="title" name="title" onChange={(e) => setTitleHelper(e)} />
      </form>
      <SimpleMdeReact
        options={customRendererOptions}
        onChange={setContentHelper}
        value={newBlogPost["content"]}
      />
      <button
        data-testid="submit-button"
        className="save-button"
        onClick={() => handleSave()}
      >
        Publish
      </button>
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
