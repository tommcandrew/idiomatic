import React, { useState, useEffect } from "react";
import DefinitionModal from "./DefinitionModal";

const Reader = ({ text, setCurrentComponent }) => {
  const [sentencesOfSpanElements, setSentencesOfSpanElements] = useState([]);
  const [selectedDef, setSelectedDef] = useState(null);
  const [selectedTargetWordObj, setSelectedTargetWordObj] = useState(null);

  useEffect(() => {
    createSpanArray();
    //eslint-disable-next-line
  }, []);

  const createSpanArray = () => {
    const sentences = text.content.match(/[^.!?]+[.!?]+/g);
    const splitSentences = sentences.map(sentence =>
      sentence.match(/[\w'’]+|[.,!?;]/g)
    );
    const sentencesOfSpanElements = splitSentences.map(
      (sentence, sentenceIndex) =>
        sentence.map((word, elementIndex) => {
          const nonWordElements = [",", ",", "'", "?", "!", ".", ":", ";"];
          let classNames = [];
          for (let i = 0; i < text.targetWordObjs.length; i++) {
            if (
              sentenceIndex === text.targetWordObjs[i].sentence &&
              elementIndex === text.targetWordObjs[i].element
            ) {
              classNames.push("reader__word--target");
            }
          }
          if (nonWordElements.includes(word)) {
            classNames.push("reader__punctuation");
          } else {
            classNames.push("reader__word");
          }
          classNames = classNames.join(" ");
          return (
            <span
              key={"word" + (sentenceIndex + elementIndex)}
              className={classNames}
              onClick={handleClick}
            >
              {word}
            </span>
          );
        })
    );
    setSentencesOfSpanElements(sentencesOfSpanElements);
  };

  const handleClick = e => {
    if (!e.target.classList.contains("reader__word--target")) {
      return;
    }
    let selectedWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    const selectedTargetWordObj = text.targetWordObjs.filter(
      obj => obj.word === selectedWord
    )[0];
    if (selectedTargetWordObj.wordType === "verb") {
      selectedWord = selectedTargetWordObj.infinitiveForm;
    }
    const def = selectedTargetWordObj.definition;
    setSelectedDef(def);
    setSelectedTargetWordObj(selectedTargetWordObj);
  };

  const closeModal = e => {
    if (
      e.target.classList.contains("definitionModal__wrapper") ||
      e.target.classList.contains("definitionModal__close")
    ) {
      setSelectedDef("");
    }
  };

  return (
    <div className="reader__wrapper">
      <div className="reader__content">
        {selectedDef && (
          <DefinitionModal
            definition={selectedDef}
            closeModal={closeModal}
            selectedTargetWordObj={selectedTargetWordObj}
          />
        )}
        <h1 className="reader__title">{text.title}</h1>
        <div className="reader__text">{sentencesOfSpanElements}</div>
        <button
          onClick={() => setCurrentComponent("GapFill")}
          className="reader__exercises-button"
        >
          Go to exercises
        </button>
      </div>
    </div>
  );
};

export default Reader;
