import React from "react";

const ConfirmModal = ({ setShowConfirmModal, actionOnConfirm, thingToDelete }) => {
  const handleCloseModal = e => {
    if (e.target.classList.contains("confirmModal__wrapper")) {
      setShowConfirmModal(false);
    }
  };
  return (
    <div className="confirmModal__wrapper" onClick={handleCloseModal}>
      <div className="confirmModal__content">
        <h3>Are you sure you want to delete {thingToDelete}?</h3>
        <div className="confirmModal__buttons">
          <button className="confirmModal__yes" onClick={actionOnConfirm}>
            Yes
          </button>
          <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
