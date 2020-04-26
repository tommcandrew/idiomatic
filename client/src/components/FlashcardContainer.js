import React, { useState } from 'react';
import FlashcardStart from './FlashcardStart'
import FlashcardTest from './FlashcardTest'

const FlashcardContainer = ({ studiedWords, setCurrentComponent, infoMessages, setInfoMessages }) => {
    const [component, setComponent] = useState("FlashcardStart")
    const [mode, setMode] = useState(null)
    const [numberCards, setNumberCards] = useState(null)

    const handleStart = (mode, numberCards) => {
        if (!numberCards) {
            setInfoMessages([
                ...infoMessages,
                {
                    text: "Enter a number",
                    type: "warning"
                }
            ]);
            return;
        }
        if (numberCards > studiedWords.length) {
            numberCards = studiedWords.length
            setInfoMessages([
                ...infoMessages,
                {
                    text: "You only have " + studiedWords.length + " cards.",
                    type: "info"
                }
            ]);
        }
        setComponent("FlashcardTest")
        setNumberCards(numberCards)
        setMode(mode)
    }

    return (
        <div className="flashcardContainer__wrapper">
            {component === "FlashcardStart" && <FlashcardStart handleStart={handleStart} studiedWords={studiedWords} />}
            {component === "FlashcardTest" && <FlashcardTest mode={mode} numberCards={numberCards} studiedWords={studiedWords} setCurrentComponent={setCurrentComponent} />}

        </div>
    )
}

export default FlashcardContainer
