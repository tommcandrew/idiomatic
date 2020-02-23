import React, { useEffect, useState } from "react";

const MatchDefinitions = ({
  text,
  handleShowSpelling,
  incrementCorrectAnswers
}) => {
  const [definitions, setDefinitions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [results, setResults] = useState({});
  const [answers, setAnswers] = useState(null);

  useEffect(() => {
    const shuffledTargetWordObjs = shuffle(text.targetWordObjs);
    const shuffledDefs = shuffledTargetWordObjs.map(obj => obj.def);
    setDefinitions(shuffledDefs);
    const answers = shuffledTargetWordObjs.map(obj => obj.word);
    setAnswers(answers);
    let selectedOptionsObj = {};
    for (let i = 0; i < text.targetWordObjs.length; i++) {
      selectedOptionsObj[i] = null;
    }
    setSelectedOptions(selectedOptionsObj);
    //eslint-disable-next-line
  }, []);

  const shuffle = array => {
    array.sort(() => Math.random() - 0.5);
    return array;
  };

  const handleSelectOption = (defIndex, optionIndex) => {
    setSelectedOptions({ ...selectedOptions, [defIndex]: optionIndex });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const userAnswerIndices = Object.values(selectedOptions);
    const userAnswerWords = userAnswerIndices.map(
      index => text.targetWords[index]
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
      <div className="matchDefinitions__content">
        <h1>Choose the word that matches the definition:</h1>
        {definitions.map((def, defIndef) => {
          return (
            <div className="matchDefinitions__field" key={"field" + defIndef}>
              <h3 key={"def" + defIndef}>{def}</h3>
              <div className="matchDefinitions__options">
                {text.targetWords.map((word, optionIndex) => (
                  <button
                    key={"option" + optionIndex}
                    onClick={() => handleSelectOption(defIndef, optionIndex)}
                    className={
                      selectedOptions[defIndef] === optionIndex
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
        <button onClick={handleSubmit}>Submit answers</button>
      </div>
      <div className="matchDefinitions__results">
        {results && Object.entries(results).length > 0 && (
          <div>
            {Object.keys(results).map((key, index) => {
              return (
                <p key={"result" + index}>
                  <span>{parseInt(key) + 1}</span>
                  <span>{results[key]}</span>
                </p>
              );
            })}
            <button onClick={handleShowSpelling}>Go to next exercise</button>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDefinitions;
