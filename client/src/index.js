import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { DeviceContextProvider } from "./context/DeviceContext";

ReactDOM.render(
  <DeviceContextProvider>
    <AuthContextProvider>
      <App />{" "}
    </AuthContextProvider>
  </DeviceContextProvider>,
  document.getElementById("root")
);
