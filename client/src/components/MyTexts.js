import React from "react";
import TextTile from "./TextTile";

const MyTexts = ({ texts, handleChooseText, deleteText }) => {
  return (
    <div className="myTexts__wrapper">
      <div className="myTexts__texts">
        {texts.map((text, index) => (
          <TextTile
            title={text.title}
            key={"saved-text" + index}
            handleChooseText={handleChooseText}
            edit="true"
            deleteText={deleteText}
          />
        ))}
      </div>
    </div>
  );
};

export default MyTexts;
