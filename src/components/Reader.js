import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dictionaryKey from "../apiKey";

const Reader = ({ text }) => {
  const [targetWords, setTargetWords] = useState(null);
  const [textAsSpanElements, setTextAsSpanElements] = useState([]);
  const [selectedDef, setSelectedDef] = useState(null);

  //this required otherwise onClick handler below uses stale state (because of closure on first render)
  const refValue = useRef(targetWords);
  useEffect(() => {
    refValue.current = targetWords;
  });

  const createTargetWordObjs = () => {
    const targetWordObjs = [];
    text.targetWords.forEach(word => {
      axios
        .get(
          "https://dictionaryapi.com/api/v3/references/learners/json/" +
            word +
            "?key=" +
            dictionaryKey
        )
        .then(res => {
          console.log(res);
          let def;
          if (res.data[0].shortdef[0]) {
            def = res.data[0].shortdef[0];
          } else {
            def = null;
          }
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
          targetWordObjs.push({
            word,
            audioUrl,
            def
          });
        });
    });
    setTargetWords(targetWordObjs);
  };

  useEffect(() => {
    //create array of objects for each target word with the word itself and the url for its audio and save to state
    createTargetWordObjs();
    //change the text into an array of span elements with classNames and save to state
    const splitText = text.text.split(" ");
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
  }, []);

  const handleTargetClick = e => {
    const selectedWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    const targetWordsUpdated = refValue.current;
    //eslint-disable-next-line
    const selectedTargetWordObj = targetWordsUpdated.filter(
      obj => obj.word === selectedWord
    )[0];
    const selectedAudioUrl = selectedTargetWordObj.audioUrl;
    const audio = new Audio(selectedAudioUrl);
    audio.play();
  };

  const handleMouseEnter = e => {
    const selectedWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    const targetWordsUpdated = refValue.current;
    const selectedTargetWordObj = targetWordsUpdated.filter(
      obj => obj.word === selectedWord
    )[0];
    const def = selectedTargetWordObj.def;
    setSelectedDef(def);
  };

  return (
    <div className="reader__wrapper">
      <div className="reader__content">
        <h1>{text.title}</h1>
        <div className="reader__text">{textAsSpanElements}</div>
        <div>{selectedDef && selectedDef}</div>
        <p>
          Target words are shown in <strong>bold</strong>.
        </p>
        <p>Click once to see the definition.</p>
        <p>Double click to hear the pronunciation</p>
        <button>Go to exercises</button>
      </div>
    </div>
  );
};

export default Reader;
