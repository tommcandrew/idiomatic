import React from 'react'

const createSpanArray = (selectedText, handleWordClick) => {
    const sentences = selectedText.content.match(/[^.!?]+[.!?]+/g);
    const splitSentences = sentences.map(sentence =>
        sentence.match(/[\w'’]+|[.,!?;]/g)
    );
    const sentencesOfSpanElements = splitSentences.map(
        (sentence, sentenceIndex) =>
            sentence.map((word, elementIndex) => {
                const nonWordElements = [",", ",", "'", "?", "!", ".", ":", ";"];
                let classNames = [];
                for (let i = 0; i < selectedText.targetWordObjs.length; i++) {
                    if (
                        sentenceIndex === selectedText.targetWordObjs[i].sentence &&
                        elementIndex === selectedText.targetWordObjs[i].element
                    ) {
                        classNames.push("editor__word--target");
                    }
                }
                if (nonWordElements.includes(word)) {
                    classNames.push("editor__punctuation");
                } else {
                    classNames.push("editor__word");
                }
                classNames = classNames.join(" ");
                return (
                    <span
                        key={"word" + (sentenceIndex + elementIndex)}
                        className={classNames}
                        onClick={handleWordClick}
                        data-sentence-index={sentenceIndex}
                        data-element-index={elementIndex}
                    >
                        {word}
                    </span>
                );
            })
    );
    return sentencesOfSpanElements
};

export default createSpanArray