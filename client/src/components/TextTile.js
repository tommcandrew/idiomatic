import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPen } from "@fortawesome/free-solid-svg-icons";

const TextTile = ({ title, level, handleChooseText, edit, deleteText }) => {
  const handleDelete = () => {
    deleteText(title);
  };

  const handleEdit = () => {
    console.log("edit");
  };

  return (
    <div className="textTile__wrapper">
      <div
        className="textTile__content"
        onClick={e => handleChooseText(e, title)}
      >
        {edit && (
          <div className="textTile__edit-buttons">
            <span className="textTile__delete-wrapper">
              <FontAwesomeIcon
                icon={faTimesCircle}
                onClick={handleDelete}
                className="textTile__delete"
              />
            </span>
            <span className="textTile__edit-wrapper">
              <FontAwesomeIcon
                icon={faPen}
                onClick={handleEdit}
                className="textTile__edit"
              />
            </span>
          </div>
        )}
        <p className="textTile__title">{title}</p>
        {level && <p className="textTile__level">{level}</p>}
      </div>
    </div>
  );
};

export default TextTile;
