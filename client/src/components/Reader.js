import React, { useState, useEffect } from "react";
import DefinitionModal from "./DefinitionModal";

const Reader = ({ text, handleShowGapFill }) => {
  const [textAsSpanElements, setTextAsSpanElements] = useState([]);
  const [selectedDef, setSelectedDef] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    createSpanArray();
    //eslint-disable-next-line
  }, []);

  const createSpanArray = () => {
    //change the text into an array of span elements with classNames and save to state
    const splitText = text.content.split(" ");
    const textAsSpanElements = splitText.map((word, index) => {
      if (
        text.targetWords.includes(
          word.replace(
            //eslint-disable-next-line
            /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
            ""
          )
        )
      ) {
        return (
          <span
            onClick={handleSingleClick}
            key={"word" + index}
            className="word word--target"
          >
            {word}
          </span>
        );
      } else {
        return (
          <span key={"word" + index} className="word">
            {word}
          </span>
        );
      }
    });
    setTextAsSpanElements(textAsSpanElements);
    //eslint-disable-next-line
  };

  const handleSingleClick = e => {
    const selectedWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    const selectedTargetWordObj = text.targetWordObjs.filter(
      obj => obj.word === selectedWord
    )[0];
    const def = selectedTargetWordObj.def;
    setSelectedDef(def);
    setSelectedWord(selectedWord);
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
            word={selectedWord}
            text={text}
          />
        )}
        <h1 className="reader__title">{text.title}</h1>
        <div className="reader__text">{textAsSpanElements}</div>
        <button
          onClick={handleShowGapFill}
          className="reader__exercises-button"
        >
          Go to exercises
        </button>
      </div>
    </div>
  );
};

export default Reader;
