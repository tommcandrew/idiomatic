import React, { useState, useEffect } from "react";

const GapFill = ({ sentences, targetWords }) => {
  const [sentencesWithSpans, setSentencesWithSpans] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [results, setResults] = useState({});

  useEffect(() => {
    createSentences();
    createAnswerObj();
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
    console.log(inputs);
    const values = [];
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value !== "") {
        values.push(inputs[i].value);
      }
    }
    const resultsObj = {};
    for (let j = 0; j < values.length; j++) {
      if (values[j] === answers[j]) {
        resultsObj[j] = "Right";
      } else {
        resultsObj[j] = "Wrong";
      }
    }
    setResults(resultsObj);
  };

  return (
    <div className="gapFill__wrapper">
      <form className="gapFill__content">
        <h1>Gap Fill:</h1>
        {sentencesWithSpans &&
          sentencesWithSpans.map((sentence, index) => (
            <div
              key={"sentence" + index}
              className="gapFill__sentence"
              onSubmit={handleSubmit}
            >
              {index}.{sentence}.
            </div>
          ))}
        <button onClick={handleSubmit}>Submit answers</button>
      </form>
      <div className="gapFill__results">
        {results &&
          Object.keys(results).map((key, index) => {
            return (
              <p key={"result" + index}>
                <span>{parseInt(key) + 1}</span>
                <span>{results[key]}</span>
              </p>
            );
          })}
      </div>
    </div>
  );
};

export default GapFill;
