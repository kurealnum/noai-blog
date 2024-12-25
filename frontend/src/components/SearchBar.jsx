import { Search } from "@mui/icons-material";
import "../styles/SearchBar.css";

function SearchBar() {
  function searchFormOnSubmit(e) {
    e.preventDefault();
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
        ></input>
        <button type="submit">
          <Search />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
