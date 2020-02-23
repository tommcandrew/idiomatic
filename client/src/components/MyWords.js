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
      <h1>My Words</h1>
      <div className="myWords__content">
        {studiedWords.map((word, index) => (
          <div key={"word" + index}>{word}</div>
        ))}
      </div>
    </div>
  );
};

export default MyWords;
