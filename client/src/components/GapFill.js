import React from "react";

const GapFill = ({ sentences }) => {
  return (
    <div className="gapFill__wrapper">
      <h1>Gap Fill:</h1>
      {sentences.map((sentence, index) => (
        <p key={"sentence" + index}>{sentence}</p>
      ))}
    </div>
  );
};

export default GapFill;
