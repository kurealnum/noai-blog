// button to mark post as flagged

import { useState } from "react";
import {
  toggleFlagComment,
  toggleFlagPost,
  toggleFlagUser,
} from "../features/helpers";

// content is used for the url (i.e, username and slug, or just slug, or id, etc)
function FlagButton({ type, isFlaggedParam, content }) {
  const [isFlagged, setIsFlagged] = useState(isFlaggedParam);

  function setIsFlaggedHelper() {
    if (type === "post") {
      toggleFlagPost(content["username"], content["slug"]).then((res) => {
        if (res) {
          setIsFlagged(!isFlagged);
        }
      });
    }
    if (type === "comment") {
      toggleFlagComment(content["id"]).then((res) => {
        if (res) {
          setIsFlagged(!isFlagged);
        }
      });
    }
    if (type === "user") {
      toggleFlagUser(content["user"]).then((res) => {
        if (res) {
          setIsFlagged(!isFlagged);
        }
      });
    }
  }

  return (
    <button onClick={setIsFlaggedHelper}>
      {isFlagged ? "Flagged" : "Not flagged"}
    </button>
  );
}

export default FlagButton;
