import React from "react";

const Results = ({ correctAnswers, numQuestions }) => {
  return (
    <div>
      <h2 className="results__wrapper">
        You got {correctAnswers} questions right out of {numQuestions}.
      </h2>
    </div>
  );
};

export default Results;
