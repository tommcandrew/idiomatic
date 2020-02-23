import React, { useState } from "react";

const Spelling = ({
  text,
  handleShowResults,
  incrementCorrectAnswers,
  markTextComplete
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);

  const playAudio = () => {
    const url = text.targetWordObjs[questionIndex].audio;
    const audio = new Audio(url);
    audio.play();
  };

  const handleSubmit = e => {
    e.preventDefault();
    let correctAnswers = 0;
    const input = e.target.text.value;
    e.target.reset();
    if (input === text.targetWordObjs[questionIndex].word) {
      alert("Right");
      correctAnswers++;
    } else {
      alert("Wrong");
    }
    incrementCorrectAnswers(correctAnswers);
    if (questionIndex === text.targetWordObjs.length - 1) {
      markTextComplete();
      handleShowResults();
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  return (
    <div className="spelling__wrapper">
      <h1>Listen to the word then write it in the box:</h1>
      <form className="spelling__content" onSubmit={handleSubmit}>
        <button type="button" onClick={playAudio}>
          Play
        </button>
        <input type="text" name="text" />
        <button type="submit">Check</button>
      </form>
    </div>
  );
};

export default Spelling;
