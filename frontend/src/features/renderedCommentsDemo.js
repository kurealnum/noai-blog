/* v8 ignore start */
// this is an "abstract" of the algorithm that renderedComments and renderedCommentsHelper uses

const x = [
  { id: 1, replyto: null, content: "content" },
  { id: 2, replyto: null, content: "content" },
  { id: 3, replyto: 1, content: "content" },
  { id: 4, replyto: 1, content: "content" },
  { id: 5, replyto: 2, content: "content" },
  { id: 6, replyto: 3, content: "content" },
];

const input = {};
x.forEach((comment) => {
  if (comment.replyto != null) {
    input[comment.replyto] = {
      ...input[comment.replyto],
      [comment.id]: comment.content,
    };
  }
});

const memo = new Set([]);
function render(nodes, level) {
  nodes.forEach((key) => {
    if (memo.has(key) == false) {
      console.log(key);
    }
    if (input[key] != undefined && memo.has(key) == false) {
      render(Object.keys(input[key]), level + 1);
    }
    memo.add(key);
  });
}

console.log(input);
render(Object.keys(input), 1);
