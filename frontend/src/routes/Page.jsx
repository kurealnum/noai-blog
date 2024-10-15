// wrapper for setting titles
import { useEffect } from "react";
import { checkIfAuthenticatedOnServer } from "../reducers/auth";
import { useDispatch } from "react-redux";
import { checkAuthenticated } from "../features/authStore/authSlice";
import { LOGGED_IN, NOT_LOGGED_IN } from "../features/types";

const blogName = "NoAI Blog - ";

function Page(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = blogName + props.title || "";
    async function updateAuth() {
      const isAuthenticatedOnServer = checkIfAuthenticatedOnServer();
      isAuthenticatedOnServer.then((isAuth) => {
        if (isAuth) {
          dispatch(checkAuthenticated(LOGGED_IN));
        } else {
          dispatch(checkAuthenticated(NOT_LOGGED_IN));
        }
      });
    }
    updateAuth();
  });
  return props.children;
}

export default Page;
