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
        <div>
            <h2>Flashcards</h2>
            <div>
                <label>Number of cards:</label>
                <input type="number" name="numberCards" onChange={handleNumberChange} />
                <label>Mode:</label>
                <select onChange={handleModeChange} defaultValue="Definition - Word">
                    <option value="Definition - Word">Definition - Word</option>
                    <option value="Word - Definition">Word - Definition</option>
                </select>
                <button onClick={handleSubmit}>Go</button>
            </div>
        </div>
    )
}

export default FlashcardStart
