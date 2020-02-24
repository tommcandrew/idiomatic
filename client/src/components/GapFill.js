import React, { useState, useEffect } from "react";
import ResultsPage from "./ResultsPage";

const GapFill = ({
  sentences,
  targetWords,
  handleShowMatchDefinitions,
  incrementCorrectAnswers
}) => {
  const [sentencesWithSpans, setSentencesWithSpans] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [results, setResults] = useState({});

  useEffect(() => {
    createSentences();
    createAnswerObj();
    //eslint-disable-next-line
  }, []);

  const createSentences = () => {
    const sentenceArray = [];
    for (let i = 0; i < sentences.length; i++) {
      const split = sentences[i]
        .replace(
          //eslint-disable-next-line
          /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
          ""
        )
        .split(" ");
      const sentenceWithSpans = split.map((word, index) => {
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
      sentenceArray.push(sentenceWithSpans);
    }
    setSentencesWithSpans(sentenceArray);
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
            {sentencesWithSpans &&
              sentencesWithSpans.map((sentence, index) => (
                <div
                  key={"sentence" + index}
                  className="gapFill__sentence"
                  onSubmit={handleSubmit}
                >
                  {index + 1}.{sentence}.
                </div>
              ))}
            <button onClick={handleSubmit} className="gapFill__submit">
              Submit answers
            </button>
          </form>
        ))}
      <div className="gapFill__results">
        {results && Object.entries(results).length > 0 && (
          <ResultsPage
            results={results}
            handleShowMatchDefinitions={handleShowMatchDefinitions}
          />
        )}
      </div>
    </div>
  );
};

export default GapFill;
