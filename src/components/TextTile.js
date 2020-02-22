import React from "react";

const TextTile = ({ title, handleChooseText }) => {
  return (
    <div className="textTile__wrapper">
      <div
        className="textTile__content"
        onClick={() => handleChooseText(title)}
      >
        <p>{title}</p>
      </div>
    </div>
  );
};

export default TextTile;
