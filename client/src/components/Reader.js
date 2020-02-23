import React, { useState, useEffect } from "react";

const Reader = ({ text, handleShowGapFill }) => {
  const [textAsSpanElements, setTextAsSpanElements] = useState([]);
  const [selectedDef, setSelectedDef] = useState(null);

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
            key={"word" + index}
            className="word word--target"
            onDoubleClick={handleDoubleClick}
            onClick={handleSingleClick}
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

  const handleDoubleClick = e => {
    const selectedWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    //eslint-disable-next-line
    const selectedTargetWordObj = text.targetWordObjs.filter(
      obj => obj.word === selectedWord
    )[0];
    const selectedAudio = selectedTargetWordObj.audio;
    const audio = new Audio(selectedAudio);
    audio.play();
  };

  const handleSingleClick = e => {
    const selectedWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    console.log(selectedWord);
    console.log(text.targetWordObjs);
    const selectedTargetWordObj = text.targetWordObjs.filter(
      obj => obj.word === selectedWord
    )[0];
    const def = selectedTargetWordObj.def;
    setSelectedDef(def);
  };

  return (
    <div className="reader__wrapper">
      <div className="reader__content">
        <div>{selectedDef && selectedDef}</div>
        <h1>{text.title}</h1>
        <div className="reader__text">{textAsSpanElements}</div>
        <p>
          Target words are shown in <strong>bold</strong>.
        </p>
        <p>Click once to see the definition.</p>
        <p>Double click to hear the pronunciation</p>
        <button onClick={handleShowGapFill}>Go to exercises</button>
      </div>
    </div>
  );
};

export default Reader;
