import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const DefinitionModal = ({ definition, closeModal, word, text }) => {
  const handlePlayAudio = () => {
    const selectedTargetWordObj = text.targetWordObjs.filter(
      obj => obj.word === word
    )[0];
    const selectedAudio = selectedTargetWordObj.audio;
    const audio = new Audio(selectedAudio);
    audio.play();
  };

  return (
    <div className="definitionModal__wrapper" onClick={closeModal}>
      <div className="definitionModal__content">
        <h3>{word}</h3>
        <p>{definition}</p>
        <FontAwesomeIcon
          icon={faPlay}
          onClick={handlePlayAudio}
          className="definitionModal__play-icon"
        />
        <p className="definitionModal__close" onClick={closeModal}>
          Close
        </p>
      </div>
    </div>
  );
};

export default DefinitionModal;
