import React, { useEffect, useState } from "react";
//get the root words

const MyWords = ({ texts, savedTexts, completedTexts, handleStartFlashcardStudy }) => {
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
      <button onClick={() => handleStartFlashcardStudy(studiedWords)}>Flashcard Study</button>
      <div className="myWords__content">
        {studiedWords.length > 0 ? (
          <table className="myWords__table">
            {/* <thead>
            <tr>
              <th>Word</th>
              <th>Definition</th>
            </tr>
            </thead> */}
            <tbody>
            {studiedWords.map((wordObj, index) => (
              <tr key={"row" + index}>
                <td className="myWords__word">{wordObj.word}</td>
                <td>{wordObj.definition}</td>

              </tr>
            ))}
            </tbody>
          </table>
        ) : (
          <h2>You don't have any studied words.</h2>
        )}
      </div>
    </div>
  );
};

export default MyWords;
