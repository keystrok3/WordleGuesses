
import { useEffect, useState } from 'react';
import './App.css'
import Board from './components/Board/Board';

const START_DATE = new Date(2024, 8, 1);

const App = () => {
  const [ targetWord, setTargetWord ] = useState()
  const [ dictionary, setDictionary ] = useState([])


  useEffect(() => {
    // fetch dictionary words
    fetch('./dictionary.json')
    .then(res => res.json())
    .then(data => setDictionary([ ...data ]))
    .catch(error => console.error(error))

    // fetch target words
    fetch('./targetWords.json')
    .then(res => res.json())
    .then(words => setTargetWord(() => {
        return words[Math.floor((new Date() - START_DATE)/1000/60/60/24)].toLocaleUpperCase()
    }))
    .catch(error => console.error(error))
  }, []);


  return (
      <div className="wordle-app">
        <div className="header"><h1>Wordle</h1></div>
        <div className="board-area">
          { 
            targetWord && dictionary ? 

            <Board 
              target_word={targetWord}
              dictionary_words={dictionary}
            /> : <h2>Loading...</h2>
          
          }
        </div>
      </div>
  )
}

export default App;
