import React from "react";

const StartPage = ({ selectedText, setCurrentComponent }) => {
  return (
    <div className="startPage__wrapper">
      {selectedText.title && (
        <div className="startPage__content">
          <h1 className="startPage__title">{selectedText.title}</h1>{" "}
          {selectedText.level && (
            <p className="startPage__level">{selectedText.level}</p>
          )}
          <div className="startPage__instructions">
            <p>
              Target words will be shown in <strong>bold</strong>.
            </p>
            <p>Click to see the definition and listen to the pronunciation.</p>
            <p>When you're finished reading, do the exercises.</p>
          </div>
          <button
            onClick={() => setCurrentComponent("Reader")}
            className="startPage__button"
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
};

export default StartPage;
