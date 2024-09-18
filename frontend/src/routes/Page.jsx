// wrapper for setting titles

import { useEffect } from "react";
const blogName = "NoAI Blog - ";

function Page(props) {
  useEffect(() => {
    document.title = blogName + props.title || "";
  });
  return props.children;
}

export default Page;
