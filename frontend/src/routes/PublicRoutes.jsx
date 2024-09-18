import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import store from "../features/authStore/store";
import { Navigate } from "react-router-dom";
import { checkIfAuthenticatedOnServer } from "../reducers/auth";
import { checkAuthenticated } from "../features/authStore/authSlice";
import { LOGGED_IN, NOT_LOGGED_IN } from "../features/types";

function PublicRoute({ children }) {
  const dispatch = useDispatch();
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    async function updateAuth() {
      const isAuthenticatedOnServer = checkIfAuthenticatedOnServer();
      isAuthenticatedOnServer.then((isAuth) => {
        if (isAuth) {
          dispatch(checkAuthenticated(LOGGED_IN));
        } else {
          dispatch(checkAuthenticated(NOT_LOGGED_IN));
        }
        setIsBusy(false);
      });
    }
    updateAuth();
  }, [dispatch, isBusy]);

  if (!isBusy) {
    const isAuth = store.getState().auth.isAuthenticated;
    console.log(isAuth);

    if (isAuth) {
      return <Navigate to="/dashboard" replace={true} />;
    }

    return children;
  }
  return <p>Loading</p>;
}

export default PublicRoute;
