import FeedComponent from "../components/FeedComponent";
import { getListFeed } from "../features/helpers";

function ListFeed() {
  const advertiseRatio = 18;
  return (
    <FeedComponent
      advertiseRatio={advertiseRatio}
      type={"lists"}
      showPaginator={true}
      defaultSearchValue={""}
      queryFunction={getListFeed}
      includePage={true}
    />
  );
}

export default ListFeed;
