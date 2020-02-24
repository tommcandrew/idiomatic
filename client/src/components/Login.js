import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Link, Redirect } from "react-router-dom";

const Login = () => {
  const { login, errorMessage, setErrorMessage, authenticated } = useContext(
    AuthContext
  );
  const handleLogin = e => {
    e.preventDefault();
    login(e);
  };

  useEffect(() => {
    setErrorMessage();
    //eslint-disable-next-line
  }, []);

  if (authenticated) {
    return <Redirect to="/main" />;
  }

  return (
    <div className="loginRegister__wrapper">
      <div className="loginRegister__header">
        <Link to="/">
          <h1 className="loginRegister__app-title">Idiomatic</h1>
        </Link>
      </div>
      <div className="loginRegister__content">
        <h2 className="loginRegister__form-title">Log in</h2>
        <form onSubmit={e => handleLogin(e)} className="loginRegister__form">
          <input type="email" name="email" placeholder="Your email" />
          <input type="password" name="password" placeholder="Your password" />
          <div className="loginRegister__error-message">{errorMessage}</div>
          <button type="submit" className="button loginRegister__button">
            Log in
          </button>
        </form>
        <div className="loginRegister__link-container">
          <p>No account?</p>
          <Link to="/register" className="loginRegister__register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
