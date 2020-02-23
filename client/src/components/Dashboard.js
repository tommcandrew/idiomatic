import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Dashboard = ({ handleShowChooseText, handleShowUploadText }) => {
  const { userName, userEmail, setAuthenticated } = useContext(AuthContext);
  const language = "English";

  return (
    <div className="dashboard__wrapper">
      <h1>Hi {userName}!</h1>
      <h2>You're learning {language}</h2>
      <button onClick={handleShowChooseText}>Choose a text</button>
      <button onClick={handleShowUploadText}>Upload a text</button>
    </div>
  );
};

export default Dashboard;
