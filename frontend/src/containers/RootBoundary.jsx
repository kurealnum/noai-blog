import { Link, useRouteError } from "react-router-dom";

function RootBoundary() {
  const error = useRouteError();
  return (
    <div id="error-page">
      <h1>HTTP {error.status}</h1>
      <p>{error.data}</p>
      <p>{error.message}</p>
      <Link to={"/feed"}>
        <i>Go home</i>
      </Link>
    </div>
  );
}

export default RootBoundary;
