function Comments({ raw }) {
  const memo = new Set([]);

  function renderedCommentsHelper(nodes, level) {
    const res = nodes.map((key) => {
      if (input[key] != undefined && memo.has(key) == false) {
        const recRes = (
          <>
            <p className={level > 1 ? "comment-reply" : null}>
              {key}, level: {level}
            </p>
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
        <p className={level > 1 ? "comment-reply" : null}>
          {key}, level: {level}
        </p>
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

  console.log(input);

  return <ul>{renderedCommentsHelper(Object.keys(input), 1)}</ul>;
}

export default Comments;
