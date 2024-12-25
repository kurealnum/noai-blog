import { useParams } from "react-router-dom";
import FeedComponent from "../components/FeedComponent";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

function Search() {
  const advertiseRatio = 18;
  const { type, search } = useParams();
  const [page, setPage] = useState(1);

  const searchQuery = useQuery({
    queryKey: { function: "search", query: search },
  });

  return (
    <FeedComponent
      data={data}
      advertiseRatio={advertiseRatio}
      type={type}
      showPaginator={true}
      page={page}
      setPage={setPage}
    />
  );
}

export default Search;
