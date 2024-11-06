import { useState } from "react";
import NoThumbnailImage from "/public/nothumbnailbyeai.png";

function Thumbnail({ url }) {
  const [isThumbnail, setIsThumbnail] = useState(true);
  if (isThumbnail) {
    if (url == null) {
      setIsThumbnail(false);
    }
    return (
      <img
        alt="thumbnail"
        src={url}
        className="blogpost-thumbnail"
        onError={() => setIsThumbnail(false)}
      ></img>
    );
  } else {
    return (
      <img
        alt="thumbnail"
        src={NoThumbnailImage}
        className="blogpost-thumbnail"
      ></img>
    );
  }
}

export default Thumbnail;
