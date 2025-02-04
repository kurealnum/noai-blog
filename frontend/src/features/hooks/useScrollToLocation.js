import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// thanks to: https://ericdcobb.medium.com/scrolling-to-an-anchor-in-react-when-your-elements-are-rendered-asynchronously-8c64f77b5f34

function useScrollToLocation() {
  const scrolledRef = useRef(false);
  const { hash } = useLocation();
  useEffect(() => {
    if (hash && !scrolledRef.current) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        scrolledRef.current = true;
      }
    }
  });
}

export default useScrollToLocation;
