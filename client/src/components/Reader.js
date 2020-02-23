import React, { useState, useEffect } from "react";
import axios from "axios";
import dictionaryKey from "../apiKey";

const Reader = ({ text, handleShowGapFill }) => {
  const [targetWords, setTargetWords] = useState(null);
  const [textAsSpanElements, setTextAsSpanElements] = useState([]);
  const [selectedDef, setSelectedDef] = useState(null);

  useEffect(() => {
    createTargetWordObjs();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (targetWords && targetWords.length > 0) {
      createSpanArray();
    }
    //eslint-disable-next-line
  }, [targetWords]);

  const createTargetWordObjs = async () => {
    //create array of objects for each target word with the word itself and the url for its audio and save to state
    const targetWordObjects = [];
    for (let i = 0; i < text.targetWords.length; i++) {
      const res = await axios.get(
        "https://dictionaryapi.com/api/v3/references/learners/json/" +
          text.targetWords[i] +
          "?key=" +
          dictionaryKey
      );
      const shortDef = res.data[0].shortdef[0];
      let audioUrl;
      if (res.data[0].hwi.prs) {
        audioUrl =
          "https://media.merriam-webster.com/soundc11/" +
          res.data[0].hwi.prs[0].sound.audio.toString().charAt(0) +
          "/" +
          res.data[0].hwi.prs[0].sound.audio +
          ".wav";
      } else {
        audioUrl = null;
      }
      targetWordObjects.push({
        word: text.targetWords[i],
        def: shortDef,
        audio: audioUrl
      });
    }
    setTargetWords(targetWordObjects);
  };

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
            onDoubleClick={handleTargetClick}
            onClick={handleMouseEnter}
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

  const handleTargetClick = e => {
    const selectedWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    //eslint-disable-next-line
    const selectedTargetWordObj = targetWords.filter(
      obj => obj.word === selectedWord
    )[0];
    const selectedAudio = selectedTargetWordObj.audio;
    const audio = new Audio(selectedAudio);
    audio.play();
  };

  const handleMouseEnter = e => {
    const selectedWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    const selectedTargetWordObj = targetWords.filter(
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
