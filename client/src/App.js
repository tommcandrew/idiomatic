import React from "react";
import "./styles/styles.scss";
import Main from "./components/Main";
import { BrowserRouter, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="app__wrapper">
      <BrowserRouter>
        <Route exact path="/" component={Main} />
      </BrowserRouter>
    </div>
  );
};

export default App;
