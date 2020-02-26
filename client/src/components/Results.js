import React from "react";

const Results = ({ correctAnswers, numQuestions }) => {
  return (
    <div className="results__wrapper">
      <h1>Your results:</h1>
      <p>
        You got {correctAnswers} questions right out of {numQuestions}.
      </p>
    </div>
  );
};

export default Results;
