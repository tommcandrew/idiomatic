import React from "react";

const Results = ({ correctAnswers, numQuestions, setCurrentComponent }) => {
  return (
    <div className="results__wrapper">
      <h1 className="results__title">Your results:</h1>
      <p className="results__info">
        You got {correctAnswers} question{correctAnswers > 0 && "s"} right out
        of {numQuestions}.
      </p>
      <button
        onClick={() => setCurrentComponent("Dashboard")}
        className="results__button"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Results;
