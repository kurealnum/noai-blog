import { Search } from "@mui/icons-material";
import "../styles/SearchBar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getPostType } from "../features/helpers";

function SearchBar({ defaultSearchValue }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function searchFormOnSubmit(e) {
    e.preventDefault();
    const type = getPostType();
    const formattedType = type === "blogPost" ? "posts" : "lists";

    if (query === "") {
      navigate("/search/" + formattedType + "/");
    } else {
      navigate("/search/" + formattedType + "/" + query + "/");
    }
  }

  return (
    <form onSubmit={(e) => searchFormOnSubmit(e)} className="search-bar">
      <div className="search-bar-wrapper">
        <label htmlFor="search" hidden aria-label="Search input">
          Search
        </label>
        <input
          type="text"
          id="search"
          defaultValue={
            defaultSearchValue === "" ? "Search..." : defaultSearchValue
          }
          onFocus={(e) => e.target.select()}
          onChange={(e) => setQuery(e.target.value)}
        ></input>
        <button type="submit">
          <Search />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
