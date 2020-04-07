import React from "react";
import TextTile from "./TextTile";

const MyTexts = ({
  texts,
  handleChooseText,
  deleteText,
  setCurrentComponent,
  handleEditText
}) => {
  return (
    <div className="myTexts__wrapper">
            <div className="myTexts__upload-wrapper">
        <button onClick={() => setCurrentComponent("UploadText")}>
          Upload Text
        </button>
      </div>
      {texts.length > 0 ? (
        <div className="myTexts__texts">
          {texts.map((text, index) => (
            <TextTile
              title={text.title}
              key={"saved-text" + index}
              handleChooseText={handleChooseText}
              edit="true"
              deleteText={deleteText}
              added={text.added}
              handleEditText={handleEditText}
            />
          ))}
        </div>
      ) : (
        <h2 className="myTexts__no-texts">You don't have any saved texts.</h2>
      )}

    </div>
  );
};

export default MyTexts;
