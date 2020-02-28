//1. shuffle targetWordObjs
//2. extract targetWords (to use as answer reference)
//3. extract definitions
//4. create object to hold selected options
//5. in render, map definitions and map target words for their options
//6. on submit, check answers by getting word from array using selected option index and comparing to word of same index in text.targetWordObjs

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import correctSound from "../assets/audio/correct.mp3";
import incorrectSound from "../assets/audio/incorrect.mp3";
import shuffle from "../utils/shuffle";

const Spelling = ({
  text,
  handleShowResults,
  incrementCorrectAnswers,
  markTextComplete
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [alertInfo, setAlertInfo] = useState("");
  const [shuffledTargetWordObjs, setShuffledTargetWordObjs] = useState([]);
  const [targetWords, setTargetWords] = useState([]);

  useEffect(() => {
    const shuffledTargetWordObjs = shuffle(text.targetWordObjs);
    setShuffledTargetWordObjs(shuffledTargetWordObjs);
    const targetWords = text.targetWordObjs.map(wordObj => {
      if (wordObj.isPlural) {
        return wordObj.singularForm;
      } else if (wordObj.wordType === "verb") {
        return wordObj.infinitiveForm;
      } else {
        return wordObj.word;
      }
    });
    setTargetWords(targetWords);
  }, []);

  const playAudio = () => {
    const url = shuffledTargetWordObjs[questionIndex].audio;
    const audio = new Audio(url);
    audio.play();
  };

  useEffect(() => {
    const alertTimer = setTimeout(() => {
      setAlertInfo(null);
    }, 2500);
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
    if (input === targetWords[questionIndex]) {
      const audio = new Audio(correctSound);
      audio.play();
      setAlertInfo({ type: "success", text: "Right!" });
      correctAnswers++;
    } else {
      const audio = new Audio(incorrectSound);
      audio.play();
      setAlertInfo({ type: "failure", text: "Wrong!" });
    }
    incrementCorrectAnswers(correctAnswers);
    if (questionIndex === shuffledTargetWordObjs.length - 1) {
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
      {alertInfo && <Alert alertInfo={alertInfo} />}
    </div>
  );
};

export default Spelling;
