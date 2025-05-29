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

  if (!showGame) {
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
  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
    <p><strong>TIC-TAC-TOE - 2025</strong></p>
    <p>Développé par Ichem / Ludo / Théo / Rémi / Nico / Anne-Marie / Calypso</p>
  </div>

  <div className="social-icons">
    {/* Ichem */}
    <a href="https://github.com/ichemsgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Ichem">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/ichemlinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Ichem">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Ludo */}
    <a href="https://github.com/ludosgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Ludo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/ludolinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Ludo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Théo */}
    <a href="https://github.com/theosgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Théo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/theolinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Théo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Rémi */}
    <a href="https://github.com/remisgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Rémi">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/remilinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Rémi">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Nico */}
    <a href="https://github.com/nicosgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Nico">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/nicolinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Nico">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Anne-Marie */}
    <a href="https://github.com/annemariesgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Anne-Marie">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/annemarielinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Anne-Marie">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Calypso */}
    <a href="https://github.com/calypsosgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Calypso">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/calypsolinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Calypso">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a>
  </div>
</footer>

    </>
  );
}

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
  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
    <p><strong>TIC-TAC-TOE - 2025</strong></p>
    <p>Développé par Ichem / Ludo / Théo / Rémi / Nico / Anne-Marie / Calypso</p>
  </div>

  <div className="social-icons">
    {/* Ichem */}
    <a href="https://github.com/ichemsgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Ichem">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/ichemlinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Ichem">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Ludo */}
    <a href="https://github.com/ludosgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Ludo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/ludolinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Ludo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Théo */}
    <a href="https://github.com/theosgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Théo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/theolinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Théo">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Rémi */}
    <a href="https://github.com/remisgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Rémi">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/remilinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Rémi">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Nico */}
    <a href="https://github.com/nicosgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Nico">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/nicolinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Nico">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Anne-Marie */}
    <a href="https://github.com/annemariesgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Anne-Marie">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/annemarielinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Anne-Marie">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a> |{' '}
    {/* Calypso */}
    <a href="https://github.com/calypsosgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub Calypso">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.5-.8 1.8-1.3.2-.7.6-1.3.8-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 011.2-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.3 1.3a11.4 11.4 0 016 0C17.3 4 18.3 4.3 18.3 4.3a4.4 4.4 0 01.1 3.3 4.7 4.7 0 011.2 3.3c0 4.7-2.9 5.7-5.6 6 .5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0012 .3" /></svg>
    </a>
    <a href="https://linkedin.com/in/calypsolinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Calypso">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3A2.5 2.5 0 0123 5.5v13A2.5 2.5 0 0120.5 21h-17A2.5 2.5 0 011 18.5v-13A2.5 2.5 0 013.5 3h17zM8 17V10H5v7h3zm-1.5-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 17v-4c0-2.2-1.2-3.2-2.8-3.2-1.3 0-2 .7-2.3 1.4V10h-3v7h3v-4c0-1 .2-2 1.4-2s1.6 1.2 1.6 2.4v3.6h3z" /></svg>
    </a>
  </div>
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
