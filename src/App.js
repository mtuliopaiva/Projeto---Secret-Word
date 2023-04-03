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
  const [score, setScore] = useState(0);


  const pickWordAndCategory = useCallback(() => {

    // Pick a random category
    const categories = Object.keys(words);

    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category };
  },[words]);



  // Start de secret word game
  // Envolvemos o start com o usecallback para resolver o problema do useffect - Problema de função,
  // com dependencia do useffect (Pode gerar um memory lick)
  const startGame = useCallback(() => {
    clearLetterStates();

    // Retornando uma palavra e categoria
    const { word, category } = pickWordAndCategory();

    // Create a array of letters e transform to lowercase
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);


    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

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
// Check if guesses ended
  useEffect(() => {
    if(guesses <= 0 ){
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }

  }, [guesses])

  // check win condition
  useEffect(() => {
    // Palavra com letras unicas exemplo OVO - OV
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if((guessedLetters.length === uniqueLetters.length) && (gameStage===stages[1].name)){
      setScore((actualScore) => (actualScore+=100));
      // restart the game with the new word
      startGame();

    }
  }, [guessedLetters, letters, startGame])


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
