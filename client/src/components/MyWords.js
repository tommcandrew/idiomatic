import React, { useEffect, useState } from "react";

const MyWords = ({ texts, savedTexts, completedTexts }) => {
  const [studiedWords, setStudiedWords] = useState([]);
  useEffect(() => {
    let wordsFromTexts = [];
    for (let i = 0; i < texts.length; i++) {
      if (completedTexts.includes(texts[i].title)) {
        const targetWordObjsCopy = JSON.parse(
          JSON.stringify(texts[i].targetWordObjs)
        );
        wordsFromTexts = [...wordsFromTexts, ...targetWordObjsCopy];
      }
    }

    let wordsFromSavedTexts = [];
    for (let i = 0; i < savedTexts.length; i++) {
      if (completedTexts.includes(savedTexts[i].title)) {
        const targetWordObjsCopy = JSON.parse(
          JSON.stringify(savedTexts[i].targetWordObjs)
        );
        wordsFromSavedTexts = [...wordsFromSavedTexts, ...targetWordObjsCopy];
      }
    }
    const studiedWords = [];
    for (let i = 0; i < wordsFromTexts.length; i++) {
      studiedWords.push(wordsFromTexts[i]);
    }
    for (let i = 0; i < wordsFromSavedTexts.length; i++) {
      studiedWords.push(wordsFromSavedTexts[i]);
    }
    setStudiedWords(studiedWords);
    //eslint-disable-next-line
  }, []);

  return (
    <div className="myWords__wrapper">
      <h1 className="myWords__title">My Words</h1>
      <div className="myWords__content">
        {studiedWords.length > 0 ? (
          studiedWords.map((obj, index) => (
            <div key={"word" + index}>{obj.word}</div>
          ))
        ) : (
          <h2>You don't have any studied words.</h2>
        )}
      </div>
    </div>
  );
};

export default MyWords;
