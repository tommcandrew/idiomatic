import React, { useState, useEffect } from "react";

const GapFill = ({
  sentences,
  targetWords,
  incrementCorrectAnswers,
  handleShowMatchDefinitions
}) => {
  const [gappedSentences, setGappedSentences] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [results, setResults] = useState({});
  const [filledSentences, setFilledSentences] = useState();

  useEffect(() => {
    createSentences();
    createAnswerObj();
    //eslint-disable-next-line
  }, []);

  const createSentences = () => {
    const gappedSentenceArray = [];
    for (let i = 0; i < sentences.length; i++) {
      const splitSentence = sentences[i]
        .replace(
          //eslint-disable-next-line
          /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
          ""
        )
        .split(" ");

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

  const createAnswerObj = () => {
    const answers = {};
    for (let i = 0; i < targetWords.length; i++) {
      answers[i] = targetWords[i];
    }
    setAnswers(answers);
  };

  const handleSubmit = e => {
    e.preventDefault();
    e.persist();
    const inputs = e.target.form.elements;
    const values = [];
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value !== "") {
        values.push(inputs[i].value);
      }
    }

    const filledSentences = [];

    for (let i = 0; i < gappedSentences.length; i++) {
      const newSentence = gappedSentences[i].map((el, index) => {
        if (el.props.className === "gapFill__input") {
          if (values[i] === answers[i]) {
            el = (
              <span key={"filled" + index} className="gapFill__filled--right">
                {values[i]}
              </span>
            );
          } else {
            el = (
              <span
                key={"filled" + index}
                className="gapFill__filled--wrong"
                data-answer={answers[i]}
              >
                {values[i]}
              </span>
            );
          }
        }
        return el;
      });
      filledSentences.push(newSentence);
    }
    setFilledSentences(filledSentences);

    const resultsObj = {};
    let correctAnswers = 0;
    for (let j = 0; j < values.length; j++) {
      if (values[j] === answers[j]) {
        resultsObj[j] = "Right";
        correctAnswers++;
      } else {
        resultsObj[j] = "Wrong";
      }
    }
    incrementCorrectAnswers(correctAnswers);
    setResults(resultsObj);
  };

  return (
    <div className="gapFill__wrapper">
      {!results ||
        (Object.entries(results).length === 0 && (
          <form className="gapFill__content">
            <h1 className="gapFill__title">Complete the sentences:</h1>
            <div className="gapFill__sentences">
              {gappedSentences &&
                gappedSentences.map((sentence, index) => (
                  <div
                    key={"sentence" + index}
                    className="gapFill__sentence"
                    onSubmit={handleSubmit}
                  >
                    {index + 1}.{sentence}.
                  </div>
                ))}
            </div>
            <button onClick={handleSubmit} className="gapFill__submit">
              Submit answers
            </button>
          </form>
        ))}
      {results && Object.entries(results).length > 0 && (
        <div className="gapFill__results">
          <h1 className="gapFill__title">
            Hover over the wrong answers to see the right answer:
          </h1>
          <div className="gapFill__result-sentences">
            {filledSentences.map((sentence, index) => (
              <div
                key={"sentence" + index}
                className="gapFill__result-sentence"
              >
                {index + 1}. {sentence}.
              </div>
            ))}
          </div>
          <button
            onClick={handleShowMatchDefinitions}
            className="gapFill__next-button"
          >
            Next Exercise
          </button>
        </div>
      )}
    </div>
  );
};

export default GapFill;
