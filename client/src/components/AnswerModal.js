import React from "react";

const AnswerModal = ({ setShowAnswerModal, answer, gotToNextQuestion }) => {
  const handleCloseModal = e => {
    if (
      e.target.classList.contains("answerModal__wrapper") ||
      e.target.classList.contains("answerModal__close")
    ) {
      setShowAnswerModal(false);
      gotToNextQuestion();
    }
  };
  return (
    <div className="answerModal__wrapper" onClick={handleCloseModal}>
      <div className="answerModal__content">
        <p className="answerModal__correct-answer">
          Correct answer: <strong>{answer}</strong>
        </p>
        <div className="answerModal__buttons">
          <button className="answerModal__close" onClick={handleCloseModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal;
