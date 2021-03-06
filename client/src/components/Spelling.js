import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import correctSound from "../assets/audio/correct.mp3";
import incorrectSound from "../assets/audio/incorrect.mp3";
import shuffle from "../utils/shuffle";
import AnswerModal from "./AnswerModal";
import getRootWords from "../utils/getRootWords";

const Spelling = ({
  text,
  setCurrentComponent,
  incrementCorrectAnswers,
  markTextComplete,
  infoMessages,
  setInfoMessages,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [shuffledTargetWordObjs, setShuffledTargetWordObjs] = useState([]);
  const [targetWords, setTargetWords] = useState([]);
  const [finished, setFinished] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const filteredTargetWordObjs = text.targetWordObjs.filter(
      (obj) => obj.audio !== null
    );
    const shuffledTargetWordObjs = shuffle(filteredTargetWordObjs);
    setShuffledTargetWordObjs(shuffledTargetWordObjs);
    const targetWords = getRootWords(shuffledTargetWordObjs);
    setTargetWords(targetWords);
    //eslint-disable-next-line
  }, []);

  const playAudio = () => {
    if (finished) {
      return;
    }
    const url = shuffledTargetWordObjs[questionIndex].audio;
    const audio = new Audio(url);
    audio.play();
  };

  const handleSubmit = (e) => {
    //check if finished questions in which caser don't play audio
    e.preventDefault();
    let correctAnswers = 0;
    const input = e.target.text.value.toLowerCase();
    if (input === "") {
      setInfoMessages([{ text: "Enter some text", type: "warning" }]);
    }
    e.target.reset();
    if (input === targetWords[questionIndex]) {
      const audio = new Audio(correctSound);
      audio.play();
      setInfoMessages([{ type: "success", text: "Right!" }]);
      correctAnswers++;
      gotToNextQuestion(correctAnswers);
    } else {
      const audio = new Audio(incorrectSound);
      audio.play();
      setInfoMessages([{ type: "failure", text: "Wrong!" }]);
      setShowAnswerModal(true);
    }
  };

  const gotToNextQuestion = (correctAnswers) => {
    if (correctAnswers) {
      incrementCorrectAnswers(correctAnswers);
    }
    if (questionIndex === shuffledTargetWordObjs.length - 1) {
      setFinished(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        markTextComplete();
        setCurrentComponent("Results");
      }, 3000);
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  return (
    <div className="spelling__wrapper">
      {!finished && (
        <h1 className="spelling__title">
          Listen to the word then write it in the box:
        </h1>
      )}
      {!finished && (
        <form className="spelling__content" onSubmit={handleSubmit}>
          <p className="spelling__question-number">
            Question: {questionIndex + 1}
          </p>
          <FontAwesomeIcon
            icon={faPlay}
            onClick={playAudio}
            className="spelling__play-icon"
          />
          <input type="text" name="text" />
          <button type="submit">Check</button>
        </form>
      )}
      {isLoading && <div className="loader"></div>}}
      {infoMessages.length > 0 && <Alert messages={infoMessages} />}
      {showAnswerModal && (
        <AnswerModal
          setShowAnswerModal={setShowAnswerModal}
          answer={targetWords[questionIndex]}
          gotToNextQuestion={gotToNextQuestion}
        />
      )}
    </div>
  );
};

export default Spelling;
