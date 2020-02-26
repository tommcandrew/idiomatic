import React from "react";

const MyWords = ({ texts, savedTexts, completedTexts }) => {
  let wordsFromTexts = [];
  for (let i = 0; i < texts.length; i++) {
    if (completedTexts.includes(texts[i].title)) {
      wordsFromTexts = [...wordsFromTexts, texts[i].targetWords];
    }
  }

  let wordsFromSavedTexts = [];
  for (let i = 0; i < savedTexts.length; i++) {
    if (completedTexts.includes(savedTexts[i].title)) {
      wordsFromTexts = [...wordsFromSavedTexts, savedTexts[i].targetWords];
    }
  }

  const studiedWords = [...wordsFromTexts, ...wordsFromSavedTexts];

  return (
    <div className="myWords__wrapper">
      <h1 className="myWords__title">My Words</h1>
      <div className="myWords__content">
        {studiedWords.length > 0 ? (
          studiedWords.map((word, index) => (
            <div key={"word" + index}>{word}</div>
          ))
        ) : (
          <h2>You don't have any studied words.</h2>
        )}
      </div>
    </div>
  );
};

export default MyWords;
