import { useParams } from "react-router-dom";
import FeedComponent from "../components/FeedComponent";
import { search } from "../features/helpers.js";
import { TYPE_BLOG_POST, TYPE_LIST } from "../features/types.js";

function Search() {
  const advertiseRatio = 18;
  const { type, query } = useParams();

  let typeSet;
  if (type === "blogs") {
    typeSet = TYPE_BLOG_POST;
  } else if (type === "lists") {
    typeSet = TYPE_LIST;
  }

  return (
    <FeedComponent
      args={[type, query]}
      advertiseRatio={advertiseRatio}
      showPaginator={true}
      defaultSearchValue={""}
      queryFunction={search}
      includePage={true}
      typeSet={typeSet}
    />
  );
}

export default Search;
