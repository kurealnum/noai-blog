import FeedComponent from "../components/FeedComponent";
import { getFeed } from "../features/helpers";
import { TYPE_LIST } from "../features/types";

function ListFeed() {
  const advertiseRatio = 18;
  return (
    <FeedComponent
      advertiseRatio={advertiseRatio}
      showPaginator={true}
      defaultSearchValue={""}
      queryFunction={getFeed}
      includePage={true}
      typeSet={TYPE_LIST}
    />
  );
}

export default ListFeed;
