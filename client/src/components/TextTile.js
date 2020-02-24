import React from "react";

const TextTile = ({ title, level, handleChooseText }) => {
  return (
    <div className="textTile__wrapper">
      <div
        className="textTile__content"
        onClick={() => handleChooseText(title)}
      >
        <p className="textTile__title">{title}</p>
        {level && <p className="textTile__level">{level}</p>}
      </div>
    </div>
  );
};

export default TextTile;
