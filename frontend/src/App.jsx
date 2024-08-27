import "./styles/App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";
import NavBar from "./containers/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
