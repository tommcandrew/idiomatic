import React from "react";

const GapFillResults = ({
  results,
  handleShowMatchDefinitions,
  handleShowSpelling
}) => {
  return (
    <div className="gapFillResults__wrapper">
      <div className="gapFillResults__content">
        <h2>Your results:</h2>
        {Object.keys(results).map((key, index) => {
          return (
            <p key={"result" + index} className="gapFillResults__result">
              <span>{parseInt(key) + 1}</span>
              <span>{results[key]}</span>
            </p>
          );
        })}
      </div>
      {handleShowMatchDefinitions && (
        <button
          onClick={handleShowMatchDefinitions}
          className="gapFillResults__button"
        >
          Go to next exercise
        </button>
      )}
      {handleShowSpelling && (
        <button onClick={handleShowSpelling} className="gapFillResults__button">
          Go to next exercise
        </button>
      )}
    </div>
  );
};

export default GapFillResults;
