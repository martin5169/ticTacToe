import { useState,useEffect } from "react";
import "./App.css";
import confetti from "canvas-confetti";

const TURNS = {
  X: "❌",
  O: "⚪",
};

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? "is-selected" : ""}`;

  const handleClick = () => {
    updateBoard(index);
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [gameWinner, setGameWinner] = useState(null);
  const [pointWinner,setPointWinner] = useState(null)
  const [pointSelection, setPointSelection] = useState(0);
  const [pointsX, setPointsX] = useState(0);
  const [pointsO, setPointsO] = useState(0);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setPointWinner(null);
    setGameWinner(null)
    setTurn(TURNS.X);
  };

  const continueGame = () => {
    setPointWinner(false);
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    const newWinner = checkGameWinner();
    
    if (newWinner) {
      confetti();
      setGameWinner(newWinner);
    } else if (checkEndGame(board)) {
      setWinner(false);
    }
  };

  const checkPointWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {

        setPointWinner(boardToCheck[a])
        let point = boardToCheck[a];
        if (point === TURNS.X) {
          setPointsX(prevPointsX => prevPointsX + 1);
          console.log(pointsX)
        } else {
          setPointsO(prevPointsO => prevPointsO + 1);
        }
        
        return boardToCheck[a];
      }
    }
    // si no hay ganador
    return null;
  };

  const checkGameWinner = ()=>{
    if (pointsO===pointSelection){
      return  TURNS.O;
    } else if (pointsX===pointSelection){   
      return TURNS.X;
    }
    return null;
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square != null);
  };

  const handleSelection = (points) => {
    setPointSelection(points);
    console.log(points)
  };

  const updateBoard = (index) => {
    //esto es para que no me deje escribir o cambiar la opcion ya tomada
    if (board[index] || gameWinner) return;
    //aca actualizamos el tablero, en base a lo que ingreso el usuario del turno
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    //aca marcamos el turno correspondiente, si esta en X pasa a O y viceversa
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    checkPointWinner(newBoard);
    //revisamos si hay un ganador
  
    
  };

  return (
    <main className="board">
      <div className="logo">
        <h1>Tic Tac Toe</h1>
      </div>

      <section className="turn">
        {turn === TURNS.X ? (
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        ) : (
          ""
        )}
        {turn === TURNS.O ? (
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        ) : (
          ""
        )}
      </section>

      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <button onClick={reset}>REINICIAR</button>

      {gameWinner !== null && (
        <section className="winner">
          <div className="text">
            <h2>{gameWinner === false ? "Empate" : "Ganó"}</h2>
            <header className="win">
              {gameWinner && <Square>{gameWinner}</Square>}
            </header>
            <footer>
              <button onClick={reset}>Reiniciar Juego</button>
            </footer>
          </div>
        </section>
      )}

      {pointWinner && (
        <section className="winner">
          <div className="text">
            <h2>{pointWinner != null ? "Punto" : ""}</h2>
            <header className="win">
              {pointWinner && <Square>{pointWinner}</Square>}
            </header>
            <footer>
              <button onClick={continueGame}>Continuar</button>
            </footer>
          </div>
        </section>
      )}

      {pointSelection === 0 && (
        <section className="winner">
          <div className="text">
            <h3>Puntos a jugar</h3>
            <footer>
              <button
                onClick={(event) => {
                  handleSelection(parseInt(event.target.textContent));
                }}
              >
                3
              </button>
              <button
                onClick={(event) => {
                  handleSelection(event.target.textContent);
                }}
              >
                5
              </button>
              <button
                onClick={(event) => {
                  handleSelection(event.target.textContent);
                }}
              >
                7
              </button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
