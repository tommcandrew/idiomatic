import React, { useState } from "react";

const GapFill = ({
  targetWords,
  targetSentences,
  incrementCorrectAnswers,
  handleShowMatchDefinitions
}) => {
  const [gappedSentences] = useState(createGappedSentences());
  const [answerObj] = useState(createAnswerObj());
  const [sentencesWithAnswers, setSentencesWithAnswers] = useState();

  function createGappedSentences() {
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
    return gappedSentenceArray;
  }

  function createAnswerObj() {
    const answerObj = {};
    for (let i = 0; i < targetWords.length; i++) {
      answerObj[i] = targetWords[i];
    }
    return answerObj;
  }

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
          if (inputValues[i] === answerObj[i]) {
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
                data-answer={answerObj[i]}
              >
                (blank)
              </span>
            );
          } else {
            el = (
              <span
                key={"filled" + index}
                className="gapFill__filled--wrong"
                data-answer={answerObj[i]}
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
      <div className="gapFill__content">
        {!sentencesWithAnswers && (
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
        {sentencesWithAnswers && (
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
              onClick={handleShowMatchDefinitions}
              className="gapFill__next"
            >
              Next Exercise
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GapFill;
