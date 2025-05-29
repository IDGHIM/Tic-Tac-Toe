import { useState } from 'react';
import './styles.css';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const winningLine = calculateWinner(squares);
  const winner = winningLine ? squares[winningLine[0]] : null;
  const status = winner
    ? `${winner} a gagné`
    : `Prochain tour : ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {[0, 1, 2].map(i => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            highlight={winningLine && winningLine.includes(i)}
          />
        ))}
      </div>
      <div className="board-row">
        {[3, 4, 5].map(i => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            highlight={winningLine && winningLine.includes(i)}
          />
        ))}
      </div>
      <div className="board-row">
        {[6, 7, 8].map(i => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            highlight={winningLine && winningLine.includes(i)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [movesLog, setMovesLog] = useState([]);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const player = xIsNext ? 'X' : 'O';
    setMovesLog(prev => [...prev, `${prev.length + 1}. Coup ${player}`]);

    const winnerLine = calculateWinner(nextSquares);
    if (winnerLine) {
      const winner = nextSquares[winnerLine[0]];
      if (winner === 'X') setXScore(prev => prev + 1);
      else if (winner === 'O') setOScore(prev => prev + 1);
    }
  }

  function restartGame() {
    setCurrentMove(0);
    setHistory([Array(9).fill(null)]);
    setMovesLog([]);
  }

  return (
    <>
      <div className="game">
        <div className="status">
          {calculateWinner(currentSquares)
            ? currentSquares[calculateWinner(currentSquares)[0]] + ' a gagné'
            : 'Prochain tour : ' + (xIsNext ? 'X' : 'O')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>

          <div className="score-buttons">
            <button>X : {xScore}</button>
            <button>O : {oScore}</button>
          </div>

          <div className="notes">
            <ul>
              {movesLog.map((coup, idx) => (
                <li key={idx}>{coup}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="game-restart">
          <button id="restart-btn" onClick={restartGame}>Restart</button>
        </div>
      </div>

      <div className="footer">
        <p><strong>TIC-TAC-TOE - 2025</strong></p>
        <p>Développé par X</p>
        <p>Contact :<br />GitHub 1<br />GitHub 2</p>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}
