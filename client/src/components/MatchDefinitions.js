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
  const [targetWords, setTargetWords] = useState([]);
  const [answerReference, setAnswerReference] = useState([]);

  useEffect(() => {
    //make copy to avoid passing by reference
    const targetWordObjsCopy = JSON.parse(JSON.stringify(text.targetWordObjs));
    //definitions will appear in random order
    const shuffledTargetWordObjs = shuffle(targetWordObjsCopy);
    const shuffledDefs = shuffledTargetWordObjs.map(obj => obj.def);
    setDefinitions(shuffledDefs);
    //but options will appear in same order as in original text object
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
    //create array of answers based on shuffled definitions to compare to on submit
    const answerReference = shuffledTargetWordObjs.map(wordObj => {
      if (wordObj.isPlural) {
        return wordObj.singularForm;
      } else if (wordObj.wordType === "verb") {
        return wordObj.infinitiveForm;
      } else {
        return wordObj.word;
      }
    });
    setAnswerReference(answerReference);
    //create object to hold user's selected options
    let selectedOptionsObj = {};
    for (let i = 0; i < text.targetWordObjs.length; i++) {
      selectedOptionsObj[i] = null;
    }
    setSelectedOptions(selectedOptionsObj);
    //eslint-disable-next-line
  }, []);

  const handleSelectOption = (defIndex, optionIndex) => {
    //check if already submitted in which case do nothing
    if (Object.entries(results).length > 0) {
      return;
    }
    setSelectedOptions({ ...selectedOptions, [defIndex]: optionIndex });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const userAnswerIndices = Object.values(selectedOptions);
    const userAnswerWords = userAnswerIndices.map(index => {
      if (index !== null) {
        return targetWords[index];
      } else {
        return "";
      }
    });
    console.log(userAnswerWords);

    let correctAnswers = 0;
    const resultsObj = {};
    for (let j = 0; j < userAnswerWords.length; j++) {
      if (userAnswerWords[j] === answerReference[j]) {
        resultsObj[j] = "Right";
        correctAnswers++;
      } else {
        resultsObj[j] = "Wrong";
      }
    }
    console.log(resultsObj);
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
                  {targetWords.map((word, optionIndex) => (
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
                  {targetWords.map((word, optionIndex) => (
                    <button
                      key={"option" + optionIndex}
                      onClick={() => handleSelectOption(defIndex, optionIndex)}
                      className={`matchDefinitions__button ${
                        answerReference[defIndex] === word &&
                        selectedOptions[defIndex] === optionIndex
                          ? "matchDefinitions__option--right"
                          : ""
                      } ${
                        answerReference[defIndex] !== word &&
                        selectedOptions[defIndex] === optionIndex
                          ? "matchDefinitions__option--wrong"
                          : ""
                      }${
                        word === "'" || word === "?"
                          ? "uploadText__punctuation"
                          : ""
                      }`}
                      data-answer={
                        answerReference[defIndex] !== word &&
                        selectedOptions[defIndex] === optionIndex
                          ? targetWords[defIndex]
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
