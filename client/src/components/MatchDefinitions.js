import React, { useEffect, useState } from "react";
import shuffle from "../utils/shuffle";

const MatchDefinitions = ({
  text,
  handleShowSpelling,
  incrementCorrectAnswers
}) => {
  const [definitions, setDefinitions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();
  const [results, setResults] = useState({});
  const [answers, setAnswers] = useState(null);

  const wordsForExercise = text.targetWordObjs.map(wordObj => {
    if (wordObj.isPlural) {
      return wordObj.singularForm;
    } else {
      return wordObj.word;
    }
  });

  useEffect(() => {
    const shuffledTargetWordObjs = shuffle(text.targetWordObjs);
    const shuffledDefs = shuffledTargetWordObjs.map(obj => obj.def);
    setDefinitions(shuffledDefs);
    const answers = shuffledTargetWordObjs.map(wordObj => {
      if (wordObj.isPlural) {
        return wordObj.singularForm;
      } else {
        return wordObj.word;
      }
    });
    setAnswers(answers);
    let selectedOptionsObj = {};
    for (let i = 0; i < text.targetWordObjs.length; i++) {
      selectedOptionsObj[i] = null;
    }
    setSelectedOptions(selectedOptionsObj);
    //eslint-disable-next-line
  }, []);

  const handleSelectOption = (defIndex, optionIndex) => {
    setSelectedOptions({ ...selectedOptions, [defIndex]: optionIndex });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.values(selectedOptions).includes(null)) {
      alert("Answer all the questions");
      return;
    }

    const userAnswerIndices = Object.values(selectedOptions);
    const userAnswerWords = userAnswerIndices.map(
      index => text.targetWordObjs[index].word
    );

    let correctAnswers = 0;

    const resultsObj = {};
    for (let j = 0; j < userAnswerWords.length; j++) {
      if (userAnswerWords[j] === answers[j]) {
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
    <div className="matchDefinitions__wrapper">
      {Object.entries(results).length === 0 && (
        <div className="matchDefinitions__content">
          <h1 className="matchDefinitions__title">
            Choose the word that matches the definition:
          </h1>
          {definitions.map((def, defIndex) => {
            return (
              <div className="matchDefinitions__field" key={"field" + defIndex}>
                <p
                  key={"def" + defIndex}
                  className="matchDefinitions__definition"
                >
                  {defIndex + 1}. {def}
                </p>
                <div className="matchDefinitions__options">
                  {wordsForExercise.map((word, optionIndex) => (
                    <button
                      key={"option" + optionIndex}
                      onClick={() => handleSelectOption(defIndex, optionIndex)}
                      className={
                        selectedOptions[defIndex] === optionIndex
                          ? "matchDefinitions__button--selected"
                          : "matchDefinitions__button"
                      }
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <button onClick={handleSubmit} className="matchDefinitions__submit">
            Submit answers
          </button>
        </div>
      )}

      {Object.entries(results).length > 0 && (
        <div className="matchDefinitions__content">
          <h1 className="matchDefinitions__title">
            Hover over the wrong answers to see the right answer:
          </h1>
          {definitions.map((def, defIndex) => {
            return (
              <div className="matchDefinitions__field" key={"field" + defIndex}>
                <p
                  key={"def" + defIndex}
                  className="matchDefinitions__definition"
                >
                  {defIndex + 1}. {def}
                </p>
                <div className="matchDefinitions__options">
                  {wordsForExercise.map((word, optionIndex) => (
                    <button
                      key={"option" + optionIndex}
                      onClick={() => handleSelectOption(defIndex, optionIndex)}
                      className={`matchDefinitions__button ${
                        answers[defIndex] === word &&
                        selectedOptions[defIndex] === optionIndex
                          ? "matchDefinitions__option--right"
                          : ""
                      } ${
                        answers[defIndex] !== word &&
                        selectedOptions[defIndex] === optionIndex
                          ? "matchDefinitions__option--wrong"
                          : ""
                      }${
                        word === "'" || word === "?"
                          ? "uploadText__punctuation"
                          : ""
                      }`}
                      data-answer={
                        answers[defIndex] !== word &&
                        selectedOptions[defIndex] === optionIndex
                          ? answers[defIndex]
                          : ""
                      }
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <button
            onClick={handleShowSpelling}
            className="matchDefinitions__next-button"
          >
            Next Exercise
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchDefinitions;
