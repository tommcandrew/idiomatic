import React, { useState, useEffect } from "react";
import shuffle from "../utils/shuffle";

const GapFill = ({
  text,
  incrementCorrectAnswers,
  setCurrentComponent,
  setInfoMessages
}) => {
  const [gappedSentences, setGappedSentences] = useState([]);
  const [sentencesWithAnswers, setSentencesWithAnswers] = useState([]);
  const [splitTargetSentences, setSplitTargetSentences] = useState([]);
  const [shuffledTargetWordObjs, setShuffledTargetWordObjs] = useState([]);

  useEffect(() => {
    //make copy to avoid passing by reference
    const targetWordObjsCopy = JSON.parse(JSON.stringify(text.targetWordObjs));
    //sentences will appear in random order
    const shuffledTargetWordObjs = shuffle(targetWordObjsCopy);
    setShuffledTargetWordObjs(shuffledTargetWordObjs);
    const sentences = text.content.split(/(?<=[.?!])\s+/);
    const targetSentences = [];
    for (let i = 0; i < shuffledTargetWordObjs.length; i++) {
      targetSentences.push(sentences[shuffledTargetWordObjs[i].sentence]);
    }
    const splitTargetSentences = targetSentences.map(sentence =>
      sentence.match(/[\w']+|[.,!?;]/g)
    );
    setSplitTargetSentences(splitTargetSentences);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    //wait for above functions to finish before creating gapped sentences
    if (splitTargetSentences.length > 0) {
      createGappedSentences();
    }
    //eslint-disable-next-line
  }, [splitTargetSentences]);

  const createGappedSentences = () => {
    //create gapped sentences based on shuffled sentences
    const gappedSentenceArray = [];
    const nonWordElements = [",", ",", "'", "?", "!", ".", ":", ";"];
    for (let i = 0; i < splitTargetSentences.length; i++) {
      //replace words in sentence with elements - input for a gap or span for a word
      const gappedSentence = splitTargetSentences[i].map((word, index) => {
        if (index === shuffledTargetWordObjs[i].element) {
          return (
            <input
              key={"word" + index}
              type="text"
              className="gapFill__input"
            />
          );
        } else {
          return (
            <span
              key={"word" + index}
              className={
                nonWordElements.includes(word)
                  ? "gapFill__punctuation"
                  : "gapFill__word"
              }
            >
              {word}
            </span>
          );
        }
      });
      gappedSentenceArray.push(gappedSentence);
    }
    setGappedSentences(gappedSentenceArray);
  };

  const handleSubmit = e => {
    e.preventDefault();
    //get all user answers
    const formElements = e.target.form.elements;
    //don't include button element
    const inputs = [...formElements].filter(el => el.nodeName === "INPUT");
    const inputValues = [];
    for (let i = 0; i < inputs.length; i++) {
      inputValues.push(inputs[i].value);
    }
    //reconstruct sentences with just span elements with classnames for gap words - right/wrong
    const sentencesWithAnswers = [];
    let correctAnswers = 0;
    for (let i = 0; i < gappedSentences.length; i++) {
      //eslint-disable-next-line
      const newSentence = gappedSentences[i].map((el, index) => {
        if (el.props.className === "gapFill__input") {
          if (
            inputValues[i].toLowerCase() ===
            shuffledTargetWordObjs[i].word.toLowerCase()
          ) {
            correctAnswers++;
            el = (
              <span key={"filled" + index} className="gapFill__filled--right">
                {inputValues[i]}
              </span>
            );
            //if user left input blank
          } else if (inputValues[i] === "") {
            el = (
              <span
                key={"filled" + index}
                className="gapFill__filled--wrong"
                data-answer={shuffledTargetWordObjs[i].word}
              ></span>
            );
          } else {
            el = (
              <span
                key={"filled" + index}
                className="gapFill__filled--wrong"
                data-answer={shuffledTargetWordObjs[i].word}
              >
                {inputValues[i]}
              </span>
            );
          }
        }
        return el;
      });
      sentencesWithAnswers.push(newSentence);
    }
    setInfoMessages([
      {
        text: correctAnswers + " out of " + gappedSentences.length + "!",
        type: "success"
      }
    ]);
    setSentencesWithAnswers(sentencesWithAnswers);
    incrementCorrectAnswers(correctAnswers);
  };

  return (
    <div className="gapFill__wrapper">
      <form className="gapFill__content">
        {sentencesWithAnswers.length === 0 && (
          <>
            <h1 className="gapFill__title">Complete the sentences:</h1>
            <div className="gapFill__sentences">
              {gappedSentences.map((sentence, index) => (
                <div className="gapFill__field" key={"field" + index}>
                  <div className="gapFill__sentence" onSubmit={handleSubmit}>
                    <span className="gapFill__sentence-num">{index + 1}</span>.
                    {sentence}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="gapFill__submit"
            >
              Submit answers
            </button>
          </>
        )}
        {sentencesWithAnswers.length > 0 && (
          <>
            <div className="gapFill__sentences">
              {sentencesWithAnswers.map((sentence, index) => (
                <div className="gapFill__field" key={"field" + index}>
                  <div className="gapFill__sentence">
                    <span className="gapFill__sentence-num">{index + 1}</span>.{" "}
                    {sentence}
                  </div>
                  <p className="gapFill__correct-answer">
                    Answer: <span>{shuffledTargetWordObjs[index].word}</span>
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentComponent("MatchDefinitions")}
              className="gapFill__next"
            >
              Next Exercise
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default GapFill;
