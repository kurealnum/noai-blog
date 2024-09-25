import { useRouteError } from "react-router-dom";

function RootBoundary() {
  const error = useRouteError();
  return (
    <div id="error-page">
      <h1>HTTP {error.status}</h1>
      <p>{error.data}</p>
      <a href="/">Go home</a>
    </div>
  );
}

export default RootBoundary;
