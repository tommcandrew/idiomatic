import React from "react";
import "./styles/styles.scss";
import Main from "./components/Main";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  return (
    <div className="app__wrapper">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <ProtectedRoute path="/main" component={Main} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
