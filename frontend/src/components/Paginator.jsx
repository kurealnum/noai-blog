function Paginator({ page, setPage }) {
  function paginatorSubmitHelper(e) {
    e.preventDefault();
    setPage(e.target.elements.page.value);
  }
  return (
    <form
      aria-label="Select a page"
      className="paginator"
      onSubmit={(e) => paginatorSubmitHelper(e)}
    >
      <label htmlFor="page" hidden>
        Page Number
      </label>
      <input defaultValue={page} type="number" id="page" name="page"></input>
      <button type="submit">Go</button>
    </form>
  );
}

export default Paginator;
