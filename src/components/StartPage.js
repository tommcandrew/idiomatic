import React from "react";

const StartPage = ({ selectedText, handleShowReader }) => {
  return (
    <div className="startPage__wrapper">
      <div className="startPage__content">
        <h1>{selectedText.title}</h1>{" "}
        <button onClick={handleShowReader}>Start</button>
      </div>
    </div>
  );
};

export default StartPage;
