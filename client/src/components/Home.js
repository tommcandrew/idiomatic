import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Redirect, Link } from "react-router-dom";

const Home = () => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loader"></div>;
  }
  if (authenticated) {
    return <Redirect to="/main" />;
  }
  return (
    <div className="home__wrapper">
      <div className="home__content">
        <div className="home__header">
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
