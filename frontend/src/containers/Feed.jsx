import { getFeed } from "../features/helpers";
import FeedComponent from "../components/FeedComponent";

function Feed() {
  const advertiseRatio = 18;
  return (
    <FeedComponent
      advertiseRatio={advertiseRatio}
      showPaginator={true}
      defaultSearchValue={""}
      queryFunction={getFeed}
      includePage={true}
    />
  );
}

export default Feed;
