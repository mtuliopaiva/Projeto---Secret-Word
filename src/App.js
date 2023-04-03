// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordsList } from "./data/words";

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';


const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesNumber = 3;



function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  // Número de tentativas do meu usuario
  const [guesses, setGuesses] = useState(guessesNumber);
  const [score, setScore] = useState(50);


  const pickWordAndCategory = () => {

    // Pick a random category
    const categories = Object.keys(words);

    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category };
  }



  // Start de secret word game
  const startGame = () => {

    // Retornando uma palavra e categoria
    const { word, category } = pickWordAndCategory();

    // Create a array of letters e transform to lowercase
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category);
    console.log(wordLetters);

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);


    setGameStage(stages[1].name);
  }

  // Process the later input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Check if ltter has been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }
    // push guessed letter or remove a chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter,
      ])
    }
    else {
      setWrongLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);

  }
// Monitora um dado e executa uma ação a cada alteração desse dado
  useEffect(() => {
    if(guesses <= 0 ){
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }

  }, [guesses])




  // retry game
  const retry = () => {
    setScore(0);
    setGuesses(guessesNumber);

    setGameStage(stages[0].name);
  }


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
      {gameStage === 'end' && <GameOver 
      retry={retry} 
      score={score}
      />}



    </div>
  );
}

export default App;
