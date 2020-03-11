import React, { useEffect, useState } from "react";
import shuffle from "../utils/shuffle";
import createMultipleChoiceQuestions from "../utils/createMultipleChoiceQuestions";

const MatchDefinitions = ({
  text,
  setCurrentComponent,
  incrementCorrectAnswers,
  setInfoMessages
}) => {
  const [selectedOptions, setSelectedOptions] = useState();
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [userAnswerWords, setUserAnswerWords] = useState([]);

  useEffect(() => {
    //make copy to avoid passing by reference
    const targetWordObjsCopy = JSON.parse(JSON.stringify(text.targetWordObjs));
    //definitions will appear in random order
    const shuffledTargetWordObjs = shuffle(targetWordObjsCopy);
    const multipleChoiceQuestions = createMultipleChoiceQuestions(
      shuffledTargetWordObjs
    );
    setMultipleChoiceQuestions(multipleChoiceQuestions);
    //create object to hold user's selected options
    let selectedOptionsObj = {};
    for (let i = 0; i < multipleChoiceQuestions.length; i++) {
      selectedOptionsObj[i] = null;
    }
    setSelectedOptions(selectedOptionsObj);
    //eslint-disable-next-line
  }, []);

  const handleSelectOption = (defIndex, optionIndex) => {
    //check if already submitted in which case do nothing
    if (completed) {
      return;
    }
    setSelectedOptions({ ...selectedOptions, [defIndex]: optionIndex });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setCompleted(true);
    const userAnswerIndices = Object.values(selectedOptions);
    const userAnswerWords = userAnswerIndices.map((optionIndex, index) => {
      if (index !== null) {
        return multipleChoiceQuestions[index].options[optionIndex];
      } else {
        return "";
      }
    });
    setUserAnswerWords(userAnswerWords);
    let correctAnswers = 0;
    for (let i = 0; i < userAnswerWords.length; i++) {
      if (userAnswerWords[i] === multipleChoiceQuestions[i].answer) {
        correctAnswers++;
      }
    }
    setInfoMessages([
      {
        text:
          correctAnswers + " out of " + multipleChoiceQuestions.length + "!",
        type: "success"
      }
    ]);
    incrementCorrectAnswers(correctAnswers);
  };

  return (
    <div className="matchDefinitions__wrapper">
      {!completed && (
        <div className="matchDefinitions__content">
          <h1 className="matchDefinitions__title">
            Choose the word that matches the definition:
          </h1>
          {multipleChoiceQuestions.map((questionObj, defIndex) => {
            return (
              <div className="matchDefinitions__field" key={"field" + defIndex}>
                <p
                  key={"def" + defIndex}
                  className="matchDefinitions__definition"
                >
                  {defIndex + 1}. {questionObj.definition}
                </p>
                <div className="matchDefinitions__options">
                  {questionObj.options.map((word, optionIndex) => (
                    <button
                      key={"option" + optionIndex}
                      onClick={() => handleSelectOption(defIndex, optionIndex)}
                      className={
                        selectedOptions[defIndex] === optionIndex
                          ? "matchDefinitions__button--selected"
                          : "matchDefinitions__button"
                      }
                    >
                      {word.toLowerCase()}
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

      {completed && (
        <div className="matchDefinitions__content">
          {multipleChoiceQuestions.map((questionObj, defIndex) => {
            return (
              <div className="matchDefinitions__field" key={"field" + defIndex}>
                <p
                  key={"def" + defIndex}
                  className="matchDefinitions__definition"
                >
                  {defIndex + 1}. {questionObj.definition}
                </p>
                <div className="matchDefinitions__options">
                  {questionObj.options.map((word, optionIndex) => (
                    <button
                      key={"option" + optionIndex}
                      onClick={() => handleSelectOption(defIndex, optionIndex)}
                      className={`matchDefinitions__button ${
                        questionObj.answer === word &&
                        selectedOptions[defIndex] === optionIndex
                          ? "matchDefinitions__option--right"
                          : ""
                      } ${
                        questionObj.answer !== word &&
                        selectedOptions[defIndex] === optionIndex
                          ? "matchDefinitions__option--wrong"
                          : ""
                      }${
                        word === "'" || word === "?"
                          ? "matchDefinitions__punctuation"
                          : ""
                      } ${
                        selectedOptions[defIndex] === null
                          ? "matchDefinitions__unanswered"
                          : ""
                      }`}
                    >
                      {word.toLowerCase()}
                    </button>
                  ))}
                </div>
                {questionObj.answer !== userAnswerWords[defIndex] && (
                  <p className="matchDefinitions__correct-answer">
                    Answer: <span>{questionObj.answer}</span>
                  </p>
                )}
              </div>
            );
          })}
          <button
            onClick={() => setCurrentComponent("Spelling")}
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
