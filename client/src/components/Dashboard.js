import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Dashboard = ({ setCurrentComponent }) => {
  const { userName } = useContext(AuthContext);

  return (
    <div className="dashboard__wrapper">
      <div className="dashboard__text">
        <h1 className="dashboard__greeting">Hi {userName}!</h1>
        <p className="dashboard__instruction">
          This is the dashboard. Get started by choosing a text or uploading one
          of your own.
        </p>
      </div>
      <div className="dashboard__buttons">
        <button onClick={() => setCurrentComponent("Texts")}>
          Choose a text
        </button>
        <button onClick={() => setCurrentComponent("UploadText")}>
          Upload a text
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
