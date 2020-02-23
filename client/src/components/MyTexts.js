import React from "react";
import TextTile from "./TextTile";

const MyTexts = ({ texts, handleChooseText }) => {
  return (
    <div className="myTexts__wrapper">
      <div className="myTexts__texts">
        {texts.map((text, index) => (
          <TextTile
            title={text.title}
            key={"saved-text" + index}
            handleChooseText={handleChooseText}
          />
        ))}
      </div>
    </div>
  );
};

export default MyTexts;
