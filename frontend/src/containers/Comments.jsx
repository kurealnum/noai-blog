import { Link, useLocation } from "react-router-dom";
import Comment from "../components/Comment";
import { isAuthenticated } from "../features/helpers";

function Comments({ raw, refetch }) {
  const location = useLocation();

  if (raw.length == 0) {
    if (isAuthenticated()) {
      return null;
    }
    return (
      <ul className="list">
        <p>
          <Link to="/login" state={{ redirectTo: location }}>
            Sign up
          </Link>{" "}
          and be the first to comment!
        </p>
      </ul>
    );
  }

  const memo = new Set([]);

  function renderedCommentsHelper(nodes, level) {
    const res = nodes.map((key) => {
      if (input[key] != undefined && memo.has(key) == false) {
        const recRes = (
          <>
            <Comment
              content={data[key]}
              isReply={level > 1}
              id={data[key]["id"]}
              refetch={refetch}
            />
            {renderedCommentsHelper(Object.keys(input[key]), level + 1)}
          </>
        );
        memo.add(key);
        return recRes;
      }
      if (memo.has(key) == true) {
        return null;
      }
      return (
        <Comment
          content={data[key]}
          isReply={level > 1}
          key={data[key]["id"]}
          refetch={refetch}
        />
      );
    });
    return res;
  }

  // creating an object to access any and all comment data in O(1)
  const data = {};
  raw.forEach((comment) => {
    data[comment.id] = comment;
  });

  // creating a tree to run renderedCommentsHelper on
  const input = {};
  const haveSeen = new Set([]);
  raw.forEach((comment) => {
    if (comment.reply_to != null) {
      input[comment.reply_to.id] = {
        ...input[comment.reply_to.id],
        [comment.id]: null,
      };
      haveSeen.add(comment.id);
      haveSeen.add(comment.reply_to.id);
    }
  });

  raw.forEach((comment) => {
    if (haveSeen.has(comment.id) == false) {
      input[comment.id] = {};
    }
  });

  // WHY DO WE HAVE TO HAVE A KEY FOR THE F**KING WRAPPER ELEMENT
  return (
    <ul className="list" key={1}>
      {renderedCommentsHelper(Object.keys(input), 1)}
    </ul>
  );
}

export default Comments;
