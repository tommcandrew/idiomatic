import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Redirect, Link } from "react-router-dom";

const Home = () => {
  const { authenticated, loading, loginDemo } = useContext(AuthContext);

  if (loading) {
    return <div className="loader"></div>;
  }
  if (authenticated) {
    return <Redirect to="/main" />;
  }

  const handleLoginDemo = () => {
    loginDemo();
  };

  return (
    <div className="home__wrapper">
      <div className="home__content">
        <div className="home__header">
          <div className="home__demo-wrapper">
            <button className="home__button" onClick={handleLoginDemo}>
              Log in as demo user
            </button>
          </div>
          <div className="home__buttons">
            <Link to="/login">
              <button className="home__button">Log in</button>
            </Link>
            <Link to="/register">
              <button className="home__button">Register</button>
            </Link>
          </div>
        </div>
        <div className="home__titles">
          <h1 className="home__app-title">Idiomatic</h1>
          <h2 className="home__app-subtitle">
            Personalise your language learning.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
