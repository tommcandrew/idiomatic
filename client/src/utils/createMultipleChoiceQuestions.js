import shuffle from "./shuffle";
import getRootWords from './getRootWords'

const createMultipleChoiceQuestions = arr => {
  const questions = [];
  const words = getRootWords(arr)
  for (let i = 0; i < arr.length; i++) {
    const question = {};
    question.definition = arr[i].definition;
    question.answer = words[i];
    const options = [];
    options.push(words[i]);
    let numOptions;
    if (arr.length > 3) {
      numOptions = 4;
    } else {
      numOptions = arr.length;
    }
    while (options.length < numOptions) {
      const randomNum = Math.floor(Math.random() * arr.length);
      const randomWord = words[randomNum];
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    const shuffledOptions = shuffle(options);
    question.options = shuffledOptions;
    questions.push(question);
  }
  return questions;
};

export default createMultipleChoiceQuestions;
