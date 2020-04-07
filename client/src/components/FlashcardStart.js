import React, { useState } from 'react'

const FlashcardStart = ({ handleStart }) => {
    const [mode, setMode] = useState(null)
    const [numberCards, setNumberCards] = useState(null)

    const handleNumberChange = e => {
        const input = e.target.value
        setNumberCards(input)
    }

    const handleModeChange = e => {
        const input = e.target.value
        setMode(input)
    }

    const handleSubmit = () => {
        handleStart(mode, numberCards)
    }

    return (
        <div className="flashcardStart__wrapper">
            <div className="flashcardStart__content">
                <div className="flashcardStart__field">
                    <label>Number of cards:</label>
                    <input type="number" name="numberCards" onChange={handleNumberChange} />
                </div>
                <div className="flashcardStart__field">

                    <label>Mode:</label>
                    <select onChange={handleModeChange} defaultValue="Definition - Word">
                        <option value="Definition - Word">Definition - Word</option>
                        <option value="Word - Definition">Word - Definition</option>
                    </select>
                </div>
                <button onClick={handleSubmit}>Go</button>
            </div>
        </div>
    )
}

export default FlashcardStart
