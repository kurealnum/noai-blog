import SimpleMdeReact from "react-simplemde-editor";
import { useState, useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { editPost, getBlogPost, slugify } from "../features/helpers";
import { CircularProgress } from "@mui/material";
import { Navigate, useParams, useRouteLoaderData } from "react-router-dom";
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

function EditPost() {
  const userData = useRouteLoaderData("root");
  const { slug } = useParams();
  const [newBlogPost, setNewBlogPost] = useState({});

  useEffect(() => {
    getBlogPost({ username: userData["username"], slug: slug }).then((res) =>
      setNewBlogPost({ ...res, slug: slug }),
    );
  }, [slug, userData]);

  const editPostMutation = useMutation({ mutationFn: editPost });

  // autosave feature
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

  function handleSave() {
    editPostMutation.mutate(newBlogPost);
  }

  function setContentHelper(content) {
    setNewBlogPost({ ...newBlogPost, content: content });
  }

  function setTitleHelper(e) {
    setNewBlogPost({ ...newBlogPost, [e.target.name]: e.target.value });
  }

  if (editPostMutation.isPending) {
    return <CircularProgress />;
  } else if (editPostMutation.isSuccess) {
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
        <input
          id="title"
          name="title"
          onChange={(e) => setTitleHelper(e)}
          defaultValue={newBlogPost["title"]}
        />
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
        Save
      </button>
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
