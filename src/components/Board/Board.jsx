/* eslint-disable react/prop-types */

import { all_correct_entries, top_empty_char } from '../../utils/top_empty_char';
import './Board.css';

import { useCallback, useEffect, useRef, useState } from "react";



const Board = ({ target_word, dictionary_words }) => {

    const currentGuess = useRef(0);

    const [ gameOver, setGameOver ] = useState(false);

    const [ guessList, setGuessList ] = useState([
        [ { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" } ],
        [ { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" } ],
        [ { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" } ],
        [ { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" } ],
        [ { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" } ],
        [ { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" }, { letter: "", code: "" } ]
    ]);


    const printLetter = useCallback((char) => {
        setGuessList(prev => {
            
            let current_guess = currentGuess.current;

            let first_empty_character = top_empty_char(prev[current_guess]);

            if( first_empty_character === -1) {
                return prev;
            }

            let newGuessList = [ ...prev ];
            newGuessList[current_guess][first_empty_character] = { letter: char, code: "" };
            
            return newGuessList;
        })
    }, []);

    
    const keyboardListener = useCallback((e) => {
        e.preventDefault();

        if(gameOver) return;
        
        if(/^[A-Za-z]$/.test(e.key)) {
            printLetter(e.key.toLocaleUpperCase());
        }

        if(e.key === 'Backspace') {
            setGuessList(prev => {
                let guess_list = [ ...prev ];

                let topempty = top_empty_char(guess_list[currentGuess.current]);

                if(topempty === 0) {
                    return prev;
                }
                if(topempty === -1) {
                    guess_list[currentGuess.current][guess_list[currentGuess.current].length - 1].letter = "";
                } else {
                    guess_list[currentGuess.current][topempty - 1].letter = "";
                }
                

                return guess_list;
                
            })
        }

        if(e.key === 'Enter') {
            
            setGuessList(prev => {
                
                if(currentGuess.current > 5) {
                    return;
                }

                let guessword = prev[currentGuess.current].map(element => element.letter).join("").toLocaleLowerCase();

                if(!dictionary_words.includes(guessword)) {
                    return prev;
                }
                
                let correct_word = target_word.split("");
            
                
                if(prev[currentGuess.current].some(elem => elem.letter.length === "" )) {
                    return prev;
                }

                
                let newGuessList = [ ...prev ];

                for(let i = 0; i < newGuessList[currentGuess.current].length; i++) {
                    if(newGuessList[currentGuess.current][i].letter === correct_word[i]) {
                        newGuessList[currentGuess.current][i] = {
                            letter: newGuessList[currentGuess.current][i].letter,
                            code: 'GREEN'
                        }
                        continue;
                    } 
                    
                    if(correct_word.includes(newGuessList[currentGuess.current][i].letter)) {
                        
                        newGuessList[currentGuess.current][i] = {
                            letter: newGuessList[currentGuess.current][i].letter,
                            code: 'YELLOW'
                        };
                        continue;
                    }

                    newGuessList[currentGuess.current][i] = {
                        letter: newGuessList[currentGuess.current][i].letter,
                        code: 'GREY'
                    };
                } 
                currentGuess.current += 1;

                return newGuessList;

            });
                        
        }
    }, [ printLetter ]);



    useEffect(() => {
        
        if(gameOver) {
            alert('Game Over!')
            return window.removeEventListener('keydown', keyboardListener)
        } 
        window.addEventListener('keydown', keyboardListener);

        return () => removeEventListener('keydown', keyboardListener);
    }, [ keyboardListener, gameOver ]);


    useEffect(() => {
        
        if(currentGuess.current === 0) return;
        
        if(guessList[currentGuess.current - 1].every(element => element.code === "")) {
            return;
        }

        let tiles_to_flip = document.querySelectorAll(`.letter-cell[data-row="${currentGuess.current - 1}"]`);

        for(let i = 0; i < tiles_to_flip.length; i++) {
            setTimeout(() => {
                tiles_to_flip[i].classList.add('flip');

                if(i === tiles_to_flip.length - 1 && all_correct_entries(guessList[currentGuess.current - 1])) {
                    
                    setTimeout(() => setGameOver(true), (i * 500) + 500)
                    return;
                }
            }, 500);
        }

        if(currentGuess.current > 5) {
            setTimeout(() => setGameOver(true), ((tiles_to_flip.length - 1) * 500) + 500)
        }
        
    }, [ currentGuess.current ])


    return (
        <div className="guess-grid">
            {
                guessList.map((guess, row) => {
                    return guess.map((cell, col) => {
                        return (
                            <div 
                                className="letter-cell"
                                key={`${row}${col}`}
                                data-color={cell.code}
                                data-row={row}
                                style={
                                    row === currentGuess.current - 1 ?
                                    { 
                                        transform:  "rotateX(360deg)",
                                        transitionDuration: '0.5s',
                                        transitionDelay: `${(col + 1) * 400}ms`
                                    }
                                    :
                                    {}
                                }
                            >
                            {cell.letter}</div>
                        )
                    })
                })
            }
        </div>
    )

};


export default Board;