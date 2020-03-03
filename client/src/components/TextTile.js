import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPen } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from './ConfirmModal';

const TextTile = ({ title, level, handleChooseText, edit, deleteText }) => {

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const handleShowDeleteModal = () => {
    setShowConfirmDelete(true)
  };

  const handleDelete = () => {
    deleteText(title);

  }

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
                onClick={handleShowDeleteModal}
                className="textTile__delete"
              />
            </span>
            <span className="textTile__edit-wrapper">
              <FontAwesomeIcon
                icon={faPen}
                className="textTile__edit"
              />
            </span>
          </div>
        )}
        <p className="textTile__title">{title}</p>
        {level && <p className="textTile__level">{level}</p>}
      </div>
      {showConfirmDelete && <ConfirmModal thingToDelete="this text" actionOnConfirm={handleDelete} setShowConfirmModal={setShowConfirmDelete}/>}
    </div>
  );
};

export default TextTile;
