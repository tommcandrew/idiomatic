import React from "react";

const Unscramble = ({ text }) => {
  return (
    <div className="unscramble__wrapper">
      <div className="unscramble__content">
        {text.targetSentences.map((sentence, index) => (
          <p key={"sentence" + index}>{sentence}</p>
        ))}
      </div>
    </div>
  );
};

export default Unscramble;
