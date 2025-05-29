import { useState } from 'react';
import './styles.css';

function Square({ value, onSquareClick, highlight, draw }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''} ${draw ? 'draw' : ''}`}
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
  const isDraw = !winner && squares.every(square => square !== null);

  const status = winner
    ? `${winner} a gagné`
    : isDraw
    ? "Match nul !"
    : `Prochain tour : ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => {
            const i = row + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                highlight={winningLine?.includes(i)}
                draw={isDraw}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  // Nouvel état pour gérer l'affichage des sections
  const [showGame, setShowGame] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, i) {
    const newHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);

    const winnerLine = calculateWinner(nextSquares);
    if (winnerLine) {
      const winner = nextSquares[winnerLine[0]];
      if (winner === 'X') setXScore(prev => prev + 1);
      if (winner === 'O') setOScore(prev => prev + 1);
    }
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((squares, move) => {
    if (move === currentMove) {
      return (
        <li key={move}>
          <p>Vous êtes au coup #{move}</p>
        </li>
      );
    }

    const desc = move ? `Aller au coup #${move}` : 'Revenir au début';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const orderedMoves = isAscending ? moves : [...moves].reverse();

  // ---------- STRUCTURE AVEC 2 SECTIONS ----------

  if (!showGame) {
    // Écran d'accueil / règles + titre
    return (
      <>
        <nav className="navbar">
          <ul>
            <li><a href="#rules">Règles</a></li>
            <li><a href="#game">Jeu</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <section className="intro-section">
          <h1 className="game-title">TIC-TAC-TOE</h1>

          <section className="rules-section" id="rules">
            <h2>Règles du jeu</h2>
            <ul>
              <li>Deux joueurs : X et O.</li>
              <li>Ils jouent à tour de rôle sur une grille 3x3.</li>
              <li>Le premier qui aligne 3 symboles identiques (horizontalement, verticalement ou en diagonale) gagne.</li>
              <li>Si toutes les cases sont remplies sans gagnant, c'est un match nul.</li>
            </ul>
          </section>

          <button
            className="start-game-btn"
            onClick={() => setShowGame(true)}
            aria-label="Commencer le jeu"
          >
            Commencer à jouer
          </button>
        </section>

        <footer className="footer" id="contact">
          <p><strong>TIC-TAC-TOE - 2025</strong></p>
          <p>Développé par X</p>
          <p>Contact :<br />GitHub 1<br />GitHub 2</p>
        </footer>
      </>
    );
  }

  // Affichage du jeu
  return (
    <>
      <nav className="navbar">
        <ul>
          <li><a href="#rules">Règles</a></li>
          <li><a href="#game">Jeu</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <div className="game-container" id="game">
        <div className="game-layout">
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            <button
              id="restart-btn"
              onClick={() => {
                setHistory([Array(9).fill(null)]);
                setCurrentMove(0);
              }}
            >
              Restart
            </button>
          </div>

          <div className="score-center">
            <div className="score">
              <p>Score X : {xScore}</p>
              <p>Score O : {oScore}</p>
            </div>
          </div>

          <div className="game-info">
            <button
              onClick={() => setIsAscending(!isAscending)}
              title="Trier l'historique"
              aria-label="Trier l'historique"
            >
              {isAscending ? '🔽' : '🔼'}
            </button>
            <ol>{orderedMoves}</ol>
          </div>
        </div>
      </div>

      <footer className="footer" id="contact">
        <p><strong>TIC-TAC-TOE - 2025</strong></p>
        <p>Développé par Ichem / Ludo / Nico / Rémi / Théo / Calypso / Anne-Marie</p>
        <p>Contact :<br />GitHub 1<br />GitHub 2</p>
      </footer>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
