import { useState } from "react";
import { login } from "../features/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

function Login() {
  const { state: locationState } = useLocation();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  function onFormSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    login(formData).then((isAuth) => {
      if (isAuth) {
        if (locationState != null) {
          navigate(locationState.redirectTo.pathname);
        } else {
          navigate("/login-redirect");
        }
      } else {
        setIsError(true);
      }
      setIsLoading(false);
    });
  }

  if (isLoading) {
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

  return (
    <div className="custom-form" id="login">
      <form onSubmit={(e) => onFormSubmit(e)} aria-label="Log in">
        <div className="item">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            onChange={(e) => onFormChange(e)}
          ></input>
        </div>
        <div className="item">
          <label htmlFor="password">Password</label>
          <div className="password">
            <input
              id="password"
              name="password"
              type={isVisible ? "text" : "password"}
              onChange={(e) => onFormChange(e)}
              maxLength={128}
            ></input>
            <button
              id="toggle-visibility"
              type="button"
              className="icon-button"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <Visibility /> : <VisibilityOff />}
            </button>
          </div>
        </div>
        <button type="submit" data-testid="login">
          Login
        </button>
        <p>
          Or{" "}
          <Link to="/register" className="accent-highlight">
            register
          </Link>
        </p>
      </form>
      <ErrorMessage
        isError={isError}
        message={"Username or password is incorrect"}
      />
    </div>
  );
}

export default Login;
