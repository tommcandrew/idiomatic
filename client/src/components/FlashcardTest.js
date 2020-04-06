import React, { useEffect, useState } from 'react';
import shuffle from '../utils/shuffle';

const FlashcardTest = ({ mode, numberCards, studiedWords, setCurrentComponent }) => {

    const [questionNum, setQuestionNum] = useState(0)
    const [testWords, setTestWords] = useState([])
    const [showCardFront, setShowCardFront] = useState(null)
    const [isFinished, setIsFinished] = useState(false)
    const [testWord, setTestWord] = useState(null)
    const [testDef, setTestDef] = useState(null)
    const [showAnswer, setShowAnswer] = useState(false)

    useEffect(() => {
        if (mode === 'Word - Definition') {
            console.log('mode is word-def so setting showcardfront to true')
            setShowCardFront(true)
        } else if (mode === 'Definition - Word') {
            console.log('mode is def-word so setting showcardfront to false')
            setShowCardFront(false)
        }
        const copiedStudiedWords = JSON.parse(JSON.stringify(studiedWords))
        const shuffledWords = shuffle(copiedStudiedWords)
        const testWords = shuffledWords.splice(0, numberCards)
        console.log('setting words for test')
        console.log(testWords)
        setTestWords(testWords)
    }, [])

    useEffect(() => {
        if (testWords && testWords.length > 0) {
            console.log('testWords have been set so calling setTestWordAndDef()')
            setTestWordAndDef()
        }
    }, [testWords])

    const checkAnswer = () => {
        console.log('checkanswer - setting showcardfront to' + !showCardFront)
        setShowCardFront(!showCardFront)
        setShowAnswer(true)
    }

    const nextQuestion = () => {
        if (questionNum === numberCards - 1) {
            setIsFinished(true)
            return
        }
        setShowAnswer(false)
        setQuestionNum(questionNum + 1)
    }

    useEffect(() => {
        if (questionNum !== 0) {

            setShowCardFront(!showCardFront)
        }
    }, [questionNum])

    useEffect(() => {
        if (questionNum !== 0) {
            setTestWordAndDef()

        }
    }, [questionNum])


    const setTestWordAndDef = () => {
        let testWord
        const currentWordObj = testWords[questionNum]
        if (currentWordObj.singularForm) {
            testWord = currentWordObj.singularForm
        } else if (currentWordObj.infinitiveForm) {
            testWord = currentWordObj.infinitiveForm;
        } else if (currentWordObj.positiveForm) {
            testWord = currentWordObj.positiveForm;
        } else {
            testWord = currentWordObj.word;
        }
        console.log('extracted and set word and def')
        console.log(testWord)
        console.log(currentWordObj.definition)
        setTestWord(testWord)
        setTestDef(currentWordObj.definition)
    }

    return (
        <div>
            {testWords && testWords.length > 0 && !isFinished && testWord && testDef && (
                <div className="FlashcardTest__card">
                    {showCardFront ? <h1>{testWord}</h1> : <h1>{testDef}</h1>}
                    {!showAnswer ? <button onClick={checkAnswer}>Check</button> : <button onClick={nextQuestion}>Next</button>}
                </div>)}
            {isFinished && <><h1>You are finished</h1><button onClick={() => setCurrentComponent("MyWords")}>Back to My Words</button></>}
        </div>
    )
}

export default FlashcardTest