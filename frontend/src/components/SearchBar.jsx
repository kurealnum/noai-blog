import { Search } from "@mui/icons-material";
import "../styles/SearchBar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchBar({ type }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function searchFormOnSubmit(e) {
    e.preventDefault();
    if (query === "") {
      navigate("/search/" + type + "/");
    } else {
      navigate("/search/" + type + "/" + query + "/");
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
          defaultValue={"Search..."}
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
