import { useParams } from "react-router-dom";
import FeedComponent from "../components/FeedComponent";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { search } from "../features/helpers.js";
import LoadingIcon from "../components/LoadingIcon.jsx";
import Paginator from "../components/Paginator.jsx";

function Search() {
  const advertiseRatio = 18;
  const { type, query } = useParams();
  const [page, setPage] = useState(1);

  const searchQuery = useQuery({
    queryKey: ["search", query, type, page],
    queryFn: () => search(type, query, page),
  });

  if (searchQuery.isPending) {
    <LoadingIcon />;
  }

  if (searchQuery.isError) {
    return (
      <>
        <h1>There was an error!</h1>
        <p>{searchQuery.error}</p>
      </>
    );
  }

  if (searchQuery.isSuccess) {
    if (!searchQuery.data || searchQuery.data.length === 0) {
      return (
        <>
          <ul className="feed">
            <h1>There were no posts to be shown!</h1>
          </ul>
          <Paginator page={page} setPage={setPage} />
        </>
      );
    }
    return (
      <FeedComponent
        data={searchQuery.data}
        advertiseRatio={advertiseRatio}
        type={type}
        showPaginator={true}
        page={page}
        setPage={setPage}
      />
    );
  }
}

export default Search;
