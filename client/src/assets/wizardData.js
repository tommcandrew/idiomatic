import chooseTextGif from './gifs/chooseText.gif';
import pasteTextGif from './gifs/pasteText.gif';
import uploadText from './gifs/uploadText.gif';
import chooseWords from './gifs/chooseWords.gif';
import startReader from './gifs/startReader.gif';
import seeDef from './gifs/seeDef.gif';
import editor from './gifs/editor.gif';
import startExercises from './gifs/startExercises.gif';
import flashcards from './gifs/flashcards.gif';

const wizardData = {
    text: [
        {
            0: "Welcome to Idiomatic! This software will help you improve your English through the use of texts. You can either choose a text from the database...",
            1: "...or you can use your own. Do this by either pasting in the text...",
            2: "...or you can upload it as a file.",
            3: "After pasting/uploading your text, you can select the words in it that you want to learn.",
            4: "You can start studying by choosing a text and clicking 'start'. This will open the Reader.",
            5: "In the Reader, you can read the text and, if you click in a target word (in bold), you will see a definition and you can also listen to the pronunciation (if available).",
            6: "If you think that a definition is inaccurate, you can go back to My Texts and click on the edit button. This will open the Editor where you can change the data saved for each target word as well as add/remove target words.",
            7: "When you've finished reading your text and feel ready to test your knowledge of the new vocabulary, click on 'Go to Exercises'. You will have three types of exercise to complete - Gap Fill, Matching Definitions and Spelling.",
            8: "When you've finished all the exercises, the target words from that text will be added to My Words. From there you can revise them by clicking on 'Flashcard Study'"
        }
    ],
    gifs: [
        {
            0: chooseTextGif,
            1: pasteTextGif,
            2: uploadText,
            3: chooseWords,
            4: startReader,
            5: seeDef,
            6: editor,
            7: startExercises,
            8: flashcards
        }
    ]
}

export default wizardData;