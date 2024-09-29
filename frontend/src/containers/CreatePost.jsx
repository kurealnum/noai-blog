import SimpleMdeReact from "react-simplemde-editor";
import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPost, slugify } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import { Navigate, useRouteLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { marked } from "marked";
import "../styles/EasyMDE.css";

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
