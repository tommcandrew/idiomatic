import React from "react";
import TextTile from "./TextTile";

const MyTexts = ({
  texts,
  handleChooseText,
  deleteText,
  handleShowUploadText
}) => {
  return (
    <div className="myTexts__wrapper">
      <div className="myTexts__texts">
        {texts.length > 0 ? (
          texts.map((text, index) => (
            <TextTile
              title={text.title}
              key={"saved-text" + index}
              handleChooseText={handleChooseText}
              edit="true"
              deleteText={deleteText}
            />
          ))
        ) : (
          <h2 className="myTexts__no-texts">You don't have any saved texts.</h2>
        )}
      </div>
      <div className="myTexts__upload-wrapper">
        <button onClick={handleShowUploadText}>Upload Text</button>
      </div>
    </div>
  );
};

export default MyTexts;
