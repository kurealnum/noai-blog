import { useState } from "react";
import { login } from "../features/auth";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const onFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  function onFormSubmit(e) {
    e.preventDefault();
    login(formData).then((isAuth) => {
      if (isAuth) {
        navigate("/login-redirect");
      } else {
        setIsError(true);
      }
    });
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
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <Visibility /> : <VisibilityOff />}
          </button>
        </div>
        <button type="submit" data-testid="login">
          Login
        </button>
      </form>
      <ErrorMessage
        isError={isError}
        message={"Username or password is incorrect"}
      />
    </div>
  );
}

export default Login;
