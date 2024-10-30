/* v8 ignore start */
// this is an "abstract" of the algorithm that renderedComments and renderedCommentsHelper uses
// it is likely not up to date

const data = [
  { id: 1, replyto: null, content: "content" },
  { id: 2, replyto: null, content: "content" },
  { id: 3, replyto: 1, content: "content" },
  { id: 4, replyto: 1, content: "content" },
  { id: 5, replyto: 2, content: "content" },
  { id: 6, replyto: 3, content: "content" },
  { id: 7, replyto: null, content: "content" },
  { id: 8, replyto: 6, content: "content" },
];

const input = {};
const haveSeen = new Set([]);
data.forEach((comment) => {
  if (comment.replyto != null) {
    input[comment.replyto] = {
      ...input[comment.replyto],
      [comment.id]: comment.content,
    };
    haveSeen.add(comment.id);
    haveSeen.add(comment.replyto);
  }
});

data.forEach((comment) => {
  if (haveSeen.has(comment.id) == false) {
    input[comment.id] = {};
  }
});

const memo = new Set([]);
function render(nodes, level) {
  return nodes.map((key) => {
    if (input[key] != undefined) {
      return [key, render(Object.keys(input[key]), level + 1)];
    }
    if (memo.has(key) == false) {
      memo.add(key);
    }
    return key;
  });
}

console.log(input);
console.log(render(Object.keys(input), 1));
