import React from "react";

const username = "Thomas";
const language = "English";

const Dashboard = ({ handleShowChooseText, handleShowUploadText }) => {
  return (
    <div className="dashboard__wrapper">
      <h1>Hi {username}!</h1>
      <h2>You're learning {language}</h2>
      <button onClick={handleShowChooseText}>Choose a text</button>
      <button onClick={handleShowUploadText}>Upload a text</button>
    </div>
  );
};

export default Dashboard;
