import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import correctSound from "../assets/audio/correct.mp3";
import incorrectSound from "../assets/audio/incorrect.mp3";

const Spelling = ({
  text,
  handleShowResults,
  incrementCorrectAnswers,
  markTextComplete
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [alertInfo, setAlertInfo] = useState("");

  const playAudio = () => {
    const url = text.targetWordObjs[questionIndex].audio;
    const audio = new Audio(url);
    audio.play();
  };

  useEffect(() => {
    const alertTimer = setTimeout(() => {
      setAlertInfo(null);
    }, 5000);
    return () => {
      clearTimeout(alertTimer);
    };
  }, [alertInfo]);

  const handleSubmit = e => {
    e.preventDefault();
    let correctAnswers = 0;
    const input = e.target.text.value.toLowerCase();
    if (input === "") {
      alert("Enter the word");
    }
    e.target.reset();
    if (input === text.targetWordObjs[questionIndex].word) {
      const audio = new Audio(correctSound);
      audio.play();
      setAlertInfo({ success: true, text: "Right!" });
      correctAnswers++;
    } else {
      const audio = new Audio(incorrectSound);
      audio.play();
      setAlertInfo({ success: false, text: "Wrong!" });
    }
    incrementCorrectAnswers(correctAnswers);
    if (questionIndex === text.targetWordObjs.length - 1) {
      setTimeout(() => {
        markTextComplete();
        handleShowResults();
      }, 3000);
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  return (
    <div className="spelling__wrapper">
      <h1 className="spelling__title">
        Listen to the word then write it in the box:
      </h1>
      <form className="spelling__content" onSubmit={handleSubmit}>
        <p>Question: {questionIndex + 1}</p>
        <FontAwesomeIcon
          icon={faPlay}
          onClick={playAudio}
          className="spelling__play-icon"
        />
        <input type="text" name="text" />
        <button type="submit">Check</button>
        {text.targetWordObjs[questionIndex].word}
      </form>
      {alertInfo && <Alert alertInfo={alertInfo} />}
    </div>
  );
};

export default Spelling;
