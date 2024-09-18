import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../features/helpers";

function Register() {
  const [formData, setFormData] = useState();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const setNewUserDataHelper = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsError(false);
  };

  function onFormSubmit(e) {
    e.preventDefault();
    register(formData).then((isAuth) => {
      if (isAuth) {
        navigate("/login");
      } else {
        setIsError(true);
      }
    });
  }

  return (
    <>
      <form onSubmit={(e) => onFormSubmit(e)} aria-label="Register">
        <div className="item">
          <label htmlFor="username">Username</label>
          <input
            name="username"
            id="username"
            onChange={(e) => setNewUserDataHelper(e)}
            maxLength={150}
          ></input>
        </div>
        <div className="item">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            onChange={(e) => setNewUserDataHelper(e)}
            maxLength={200}
          ></input>
        </div>
        <div className="item">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={(e) => setNewUserDataHelper(e)}
            maxLength={128}
          ></input>
        </div>
        <div className="item">
          <label htmlFor="first_name">First name</label>
          <input
            id="first_name"
            name="first_name"
            onChange={(e) => setNewUserDataHelper(e)}
            maxLength={50}
          ></input>
        </div>
        <div className="item">
          <label htmlFor="last_name">Last name</label>
          <input
            id="last_name"
            name="last_name"
            onChange={(e) => setNewUserDataHelper(e)}
            maxLength={50}
          ></input>
        </div>
        <div className="item">
          <label htmlFor="about_me">About me</label>
          <textarea
            id="about_me"
            name="about_me"
            onChange={(e) => setNewUserDataHelper(e)}
            maxLength={250}
          ></textarea>
        </div>
        <div className="item">
          <label htmlFor="technical_info">Technical Info</label>
          <textarea
            id="technical_info"
            name="technical_info"
            onChange={(e) => setNewUserDataHelper(e)}
            maxLength={150}
          ></textarea>
        </div>
        <button id="save" type="submit">
          Register
        </button>
      </form>
      <Snackbar
        open={isError}
        autoHideDuration={5000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error" variant="filled">
          Something went wrong!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Register;
