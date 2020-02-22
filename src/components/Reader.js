import React from "react";

const Reader = ({ text }) => {
  const splitText = text.text.split(" ");
  const highlightedText = splitText.map((word, index) => {
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
        <span key={"word" + index} className="word word--target">
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

  return (
    <div className="reader__wrapper">
      <div className="reader__content">
        <h1>{text.title}</h1>
        <div className="reader__text">{highlightedText}</div>
        <button>Go to exercises</button>
      </div>
    </div>
  );
};

export default Reader;
