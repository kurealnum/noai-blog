import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

function CreatePost() {
  const [content, setContent] = useState("Write your blog post here!");

  const createPostMutation = useMutation({});

  function handleSave() {
    // ...
  }

  return (
    <div id="create-post">
      <SimpleMdeReact onChange={setContent} value={content} />
      <button onClick={() => handleSave()}></button>
    </div>
  );
}

export default CreatePost;
