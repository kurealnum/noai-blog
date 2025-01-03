import { useParams } from "react-router-dom";
import FeedComponent from "../components/FeedComponent";
import { search } from "../features/helpers.js";

function Search() {
  const advertiseRatio = 18;
  const { type, query } = useParams();
  return (
    <FeedComponent
      args={[type, query]}
      advertiseRatio={advertiseRatio}
      type={"posts"}
      showPaginator={true}
      defaultSearchValue={""}
      queryFunction={search}
      includePage={true}
    />
  );
}

export default Search;
