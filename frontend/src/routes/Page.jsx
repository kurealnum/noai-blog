// wrapper for setting titles
import { Suspense, useEffect, useState } from "react";
import { checkIfAuthenticatedOnServer } from "../reducers/auth";
import { useDispatch } from "react-redux";
import { checkAuthenticated } from "../features/authStore/authSlice";
import {
  IS_MODERATOR_TRUE,
  LOGGED_IN,
  NOT_LOGGED_IN,
  IS_ADMIN_TRUE,
  IS_SUPERUSER_TRUE,
} from "../features/types";
import { CircularProgress } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  isAdmin,
  isAuthenticated,
  isMod,
  isSuperuser,
} from "../features/helpers";

const blogName = "byeAI | ";

function Page({ children, title, type }) {
  const dispatch = useDispatch();
  const [isBusy, setIsBusy] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to slash if route doesn't end with slash
    const path = location.pathname;
    const pathLen = location.pathname.length;
    if (location.pathname[pathLen - 1] !== "/") {
      navigate(path + "/", { replace: true });
    }

    document.title = blogName + title || "";
    async function updateAuth() {
      const isAuthenticatedOnServer = checkIfAuthenticatedOnServer();
      isAuthenticatedOnServer.then((authData) => {
        if (authData["is_authenticated"] === true) {
          dispatch(checkAuthenticated(LOGGED_IN));
          if (authData["is_mod"]) {
            dispatch(checkAuthenticated(IS_MODERATOR_TRUE));
          }
          if (authData["is_admin"]) {
            dispatch(checkAuthenticated(IS_ADMIN_TRUE));
          }
          if (authData["is_superuser"]) {
            dispatch(checkAuthenticated(IS_SUPERUSER_TRUE));
          }
        } else {
          dispatch(checkAuthenticated(NOT_LOGGED_IN));
        }
        setIsBusy(false);
      });
    }
    updateAuth();
  }, [dispatch, location.pathname, navigate, title]);

  if (isBusy) {
    return (
      <CircularProgress
        sx={{
          position: "absolute",
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          margin: "auto",
        }}
      />
    );
  }

  if (
    type === "public" ||
    (type === "private" && isAuthenticated()) ||
    (type === "moderator" && isMod()) ||
    (type === "admin" && isAdmin()) ||
    (type === "superuser" && isSuperuser())
  ) {
    return (
      <Suspense
        fallback={
          <CircularProgress
            sx={{
              position: "absolute",
              left: "0",
              right: "0",
              top: "0",
              bottom: "0",
              margin: "auto",
            }}
          />
        }
      >
        {children}
      </Suspense>
    );
  } else if (type == "public-only" && isAuthenticated()) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default Page;
