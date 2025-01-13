import { getFeed } from "../features/helpers";
import FeedComponent from "../components/FeedComponent";
import { TYPE_BLOG_POST } from "../features/types";

function Feed() {
  const advertiseRatio = 18;
  return (
    <FeedComponent
      advertiseRatio={advertiseRatio}
      showPaginator={true}
      defaultSearchValue={""}
      queryFunction={getFeed}
      includePage={true}
      typeSet={TYPE_BLOG_POST}
    />
  );
}

export default Feed;
