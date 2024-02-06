import { useState } from "react";
import "./App.css";
import confetti from "canvas-confetti"

export const TURNS = {
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
  const [winner, setWinner] = useState(null);

  const reiniciar = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setTurn(TURNS.X)
  };

  const checkWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        console.log(boardToCheck)
        return boardToCheck[a];
      }
    }
    // si no hay ganador
    return null;
  };

  const checkEndGame = (newBoard)=>{
      return newBoard.every((square)=>square!=null)
  }

  const updateBoard = (index) => {
    //esto es para que no me deje escribir o cambiar la opcion ya tomada
    if (board[index] || winner) return;
    //aca actualizamos el tablero, en base a lo que ingreso el usuario del turno
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    //aca marcamos el turno correspondiente, si esta en X pasa a O y viceversa
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    //revisamos si hay un ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti()
      setWinner(newWinner);
    }else if (checkEndGame(newBoard)){
      setWinner(false)
    }
  };

  return (
    <main className="board">
      <div className="logo">
      <h1>Tic Tac Toe</h1>
      </div>
      <section className="turn">
        {turn === TURNS.X ? <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>:""}
        {turn === TURNS.O ? <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>:""}
      </section>
      
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {" "}
              {square}
            </Square>
          );
        })}
      </section>
      
      <button onClick={reiniciar}>REINICIAR</button>

      {winner != null && (
        <section className="winner">
          <div className="text">
            <h2>
              {winner === false ? "Empate" : "Ganó"}
            </h2>
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>
            <footer>
              <button onClick={reiniciar}>Reiniciar Juego</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
