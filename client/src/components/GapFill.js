//1. shuffle targetWordObjs
//2. extract targetWords (to use as answer reference)
//3. extract sentences and convert into gapped sentences
//4. render these sentences
//5. on submit, create new array of filled sentences and check whether input is correcy by comparing to words array

import React, { useState, useEffect } from "react";
import shuffle from "../utils/shuffle";

const GapFill = ({
  text,
  incrementCorrectAnswers,
  handleShowMatchDefinitions
}) => {
  const [gappedSentences, setGappedSentences] = useState([]);
  const [sentencesWithAnswers, setSentencesWithAnswers] = useState([]);
  const [targetWords, setTargetWords] = useState([]);
  const [shuffledTargetWordObjs, setShuffledTargetWordObjs] = useState([]);

  useEffect(() => {
    //make copy to avoid passing by reference
    const targetWordObjsCopy = JSON.parse(JSON.stringify(text.targetWordObjs));
    //sentences will appear in random order
    const shuffledTargetWordObjs = shuffle(targetWordObjsCopy);
    setShuffledTargetWordObjs(shuffledTargetWordObjs);
    const targetWords = targetWordObjsCopy.map(obj => obj.word);
    setTargetWords(targetWords);
  }, []);

  useEffect(() => {
    //wait for above functions to finish before creating gapped sentences
    if (targetWords.length > 0) {
      createGappedSentences();
    }
  }, [targetWords]);

  const createGappedSentences = () => {
    //create gapped sentences based on shuffled sentences
    const targetSentences = shuffledTargetWordObjs.map(obj => obj.sentence);
    const gappedSentenceArray = [];
    for (let i = 0; i < targetSentences.length; i++) {
      //remove all punctuation from sentence and split into individual words
      const splitSentence = targetSentences[i]
        .replace(
          //eslint-disable-next-line
          /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
          ""
        )
        .split(" ");
      //replace words in sentence with elements - input for a gap or span for a word
      const gappedSentence = splitSentence.map((word, index) => {
        if (targetWords.includes(word)) {
          return (
            <input
              key={"word" + index}
              type="text"
              className="gapFill__input"
            />
          );
        } else {
          return (
            <span key={"word" + index} className="gapFill__word">
              {word}
            </span>
          );
        }
      });
      gappedSentenceArray.push(gappedSentence);
    }
    setGappedSentences(gappedSentenceArray);
  };

  const handleSubmit = e => {
    e.preventDefault();
    //get all user answers
    const inputs = e.target.form.elements;
    const inputValues = [];
    for (let i = 0; i < inputs.length; i++) {
      inputValues.push(inputs[i].value);
    }
    //reconstruct sentences with just span elements with classnames for gap words - right/wrong
    const sentencesWithAnswers = [];
    let correctAnswers = 0;
    for (let i = 0; i < gappedSentences.length; i++) {
      const newSentence = gappedSentences[i].map((el, index) => {
        if (el.props.className === "gapFill__input") {
          if (inputValues[i] === targetWords[i]) {
            correctAnswers++;
            el = (
              <span key={"filled" + index} className="gapFill__filled--right">
                {inputValues[i]}
              </span>
            );
            //if user left input blank
          } else if (inputValues[i] === "") {
            el = (
              <span
                key={"filled" + index}
                className="gapFill__filled--wrong"
                data-answer={targetWords[i]}
              >
                (blank)
              </span>
            );
          } else {
            el = (
              <span
                key={"filled" + index}
                className="gapFill__filled--wrong"
                data-answer={targetWords[i]}
              >
                {inputValues[i]}
              </span>
            );
          }
        }
        return el;
      });
      sentencesWithAnswers.push(newSentence);
    }
    setSentencesWithAnswers(sentencesWithAnswers);
    incrementCorrectAnswers(correctAnswers);
  };

  return (
    <div className="gapFill__wrapper">
      <form className="gapFill__content">
        {sentencesWithAnswers.length === 0 && (
          <>
            <h1 className="gapFill__title">Complete the sentences:</h1>
            <div className="gapFill__sentences">
              {gappedSentences.map((sentence, index) => (
                <div
                  key={"sentence" + index}
                  className="gapFill__sentence"
                  onSubmit={handleSubmit}
                >
                  {index + 1}.{sentence}.
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="gapFill__submit"
            >
              Submit answers
            </button>
          </>
        )}
        {sentencesWithAnswers.length > 0 && (
          <>
            <h1 className="gapFill__title">
              Hover over the wrong answers to see the right answer:
            </h1>
            <div className="gapFill__sentences">
              {sentencesWithAnswers.map((sentence, index) => (
                <div key={"sentence" + index} className="gapFill__sentence">
                  {index + 1}. {sentence}.
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleShowMatchDefinitions}
              className="gapFill__next"
            >
              Next Exercise
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default GapFill;
