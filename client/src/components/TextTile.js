import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPen } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "./ConfirmModal";

const TextTile = ({
  title,
  level,
  handleChooseText,
  edit,
  deleteText,
  isCompleted,
  added,
  handleEditText,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const handleShowDeleteModal = (e) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleDelete = () => {
    deleteText(title);
  };

  let addedFormatted;
  if (added) {
    const day = added.substr(8, 2);
    const month = added.substr(5, 2);
    const year = added.substr(0, 4);
    addedFormatted = day + "/" + month + "/" + year;
  }

  let shortenedTitle;
  if (title.length > 40) {
    shortenedTitle = title.substr(0, 40) + "...";
  }

  return (
    <div className="textTile__wrapper">
      <div
        className="textTile__content"
        onClick={(e) => handleChooseText(e, title)}
      >
        {edit && (
          <div className="textTile__edit-buttons-wrapper">
            <div className="textTile__edit-buttons">
              <span className="textTile__delete-wrapper">
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  onClick={handleShowDeleteModal}
                  className="textTile__delete"
                />
              </span>
              <span className="textTile__edit-wrapper">
                <FontAwesomeIcon
                  icon={faPen}
                  className="textTile__edit"
                  onClick={(e) => handleEditText(e, title)}
                />
              </span>
            </div>
          </div>
        )}
        <p className="textTile__title">
          {shortenedTitle ? shortenedTitle : title}
        </p>
        {level && <p className="textTile__level">{level}</p>}
        {isCompleted && <p className="textTile__completed">Completed</p>}
        {addedFormatted && <p className="textTile__added">{addedFormatted}</p>}
      </div>
      {showConfirmDelete && (
        <ConfirmModal
          thingToDelete="this text"
          actionOnConfirm={handleDelete}
          setShowConfirmModal={setShowConfirmDelete}
        />
      )}
    </div>
  );
};

export default TextTile;
