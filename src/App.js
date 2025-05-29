import { useState } from 'react';
import "./styles.css";

function Square({ value, onSquareClick }) {}
  return (
    <button
      className={`square ${isWinning ? "winning" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const winningLine = result?.line ?? [];
  const isDraw = !squares.includes(null) && !winner;

  let status;
  if (winner) {
    status = winner + ' a gagné';
  } else {
    status = "Prochain tour : " + (xIsNext ? "X" : "O");
  }

  const rows = 3;
  const cols = 3;
  const boardRow = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) { // Loop through each row
    const rowSquares = []; // Create an array to hold the squares for the current row
    
    for (let colIndex = 0; colIndex < cols; colIndex++) { // Loop through each column
      const squareIndex = rowIndex * cols + colIndex; // Calculate the index for the square
      rowSquares.push(<Square value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex)} />); 
    }
    // Create a row of squares and add it to the rowsArray
    boardRow.push(
    <div className="board-row">
      {rowSquares}
    </div>
  );
  }
  return ( 
    <div>
      <div className="status">{status}</div>
      {boardRow}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [xMoves, setXMoves] = useState(0);
  const [oMoves, setOMoves] = useState(0);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    if (xIsNext) {
      setXMoves(xMoves + 1);
    } else {
      setOMoves(oMoves + 1);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Aller au coup #" + move;
    } else {
      description = "Revenir au début";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div className="game-stats">
          <p>X : {xMoves}</p>
          <p>O : {oMoves}</p>
        </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}
