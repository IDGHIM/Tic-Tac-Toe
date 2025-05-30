// Importation de la fonction useState de React pour la gestion d'états locaux
import { useState } from 'react';
// Importation du fichier CSS pour les styles
import './styles.css';


// ---------------------- Composant Case ----------------------
function Square({ value, onSquareClick, highlight, draw }) {
  return (
    <button
      // Application conditionnelle de classes CSS si la case est dans une ligne gagnante (highlight)
      // ou s'il y a égalité (draw)
      className={`square ${highlight ? 'highlight' : ''} ${draw ? 'draw' : ''}`}
      onClick={onSquareClick} // Appel de la fonction lors d’un clic sur la case
    >
      {value} {/* Affiche "X", "O" ou rien */}
    </button>
  );
}


// ---------------------- Composant Plateau ----------------------
function Board({ xIsNext, squares, onPlay }) {
  // Gère le clic sur une case
  function handleClick(i) {
    // Ignore le clic si la partie est déjà gagnée ou si la case est remplie
    if (calculateWinner(squares) || squares[i]) return;

    // Crée une nouvelle copie du plateau
    const nextSquares = squares.slice();
    // Assigne 'X' ou 'O' à la case cliquée
    nextSquares[i] = xIsNext ? 'X' : 'O';
    // Appelle la fonction du composant parent avec le nouveau plateau
    onPlay(nextSquares, i);
  }

  // Vérifie si une ligne gagnante existe
  const winningLine = calculateWinner(squares);
  // Récupère le symbole gagnant à partir de la ligne gagnante
  const winner = winningLine ? squares[winningLine[0]] : null;
  // Vérifie si toutes les cases sont remplies sans gagnant
  const isDraw = !winner && squares.every(square => square !== null);

  // Détermine le message de statut
  const status = winner
    ? `${winner} a gagné`
    : isDraw
    ? "Match nul !"
    : `Prochain tour : ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      {/* Affichage du statut du jeu */}
      <div className="status">{status}</div>

      {/* Génère les 3 lignes du plateau */}
      {[0, 3, 6].map(row => (
        <div className="board-row" key={row}>
          {/* Génère 3 cases par ligne */}
          {[0, 1, 2].map(col => {
            const i = row + col;
            return (
              <Square
                key={i}
                value={squares[i]} // Affiche X, O ou vide
                onSquareClick={() => handleClick(i)} // Gère le clic
                highlight={winningLine?.includes(i)} // Met en surbrillance si la case fait partie de la ligne gagnante
                draw={isDraw} // Met en surbrillance si match nul
              />
            );
          })}
        </div>
      ))}
    </>
  );
}


// ---------------------- Composant Principal ----------------------
export default function Game() {
  // État : historique des plateaux
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // État : index du coup actuel dans l'historique
  const [currentMove, setCurrentMove] = useState(0);
  // État : score du joueur X
  const [xScore, setXScore] = useState(0);
  // État : score du joueur O
  const [oScore, setOScore] = useState(0);
  // État : ordre de tri de l'historique
  const [isAscending, setIsAscending] = useState(true);

  // Détermine le joueur actif (X commence)
  const xIsNext = currentMove % 2 === 0;
  // Plateau actuel selon l’historique
  const currentSquares = history[currentMove];

  // Gère un nouveau coup joué
  function handlePlay(nextSquares, i) {
    // Met à jour l’historique en supprimant les coups après le courant
    const newHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);

    // Vérifie s’il y a un gagnant et met à jour les scores
    const winnerLine = calculateWinner(nextSquares);
    if (winnerLine) {
      const winner = nextSquares[winnerLine[0]];
      if (winner === 'X') setXScore(prev => prev + 1);
      if (winner === 'O') setOScore(prev => prev + 1);
    }
  }

  // Permet de naviguer dans l’historique des coups
  function jumpTo(move) {
    setCurrentMove(move);
  }

  // Génère la liste des mouvements
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

  // Trie l’historique selon l’ordre sélectionné
  const orderedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <>
      {/* ---------- Barre de navigation ---------- */}
      <nav className="navbar">
        <ul>
          <li><a href="#rules">Règles</a></li>
          <li><a href="#game">Jeu</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ---------- Section Règles ---------- */}
      <section className="rules-section" id="rules">
        <h2>Règles du jeu</h2>
        <ul>
          <li>Deux joueurs : X et O.</li>
          <li>Ils jouent à tour de rôle sur une grille 3x3.</li>
          <li>Le premier qui aligne 3 symboles identiques gagne.</li>
          <li>Si toutes les cases sont remplies sans gagnant, c’est un match nul.</li>
        </ul>
      </section>

      {/* ---------- Conteneur principal du jeu ---------- */}
      <div className="game-container" id="game">
        <div className="game-layout">
          {/* Plateau de jeu */}
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            <button
              id="restart-btn"
              onClick={() => {
                // Réinitialise le plateau mais garde les scores
                setHistory([Array(9).fill(null)]);
                setCurrentMove(0);
              }}
            >
              Restart
            </button>
          </div>

          {/* Affichage des scores */}
          <div className="score-center">
            <div className="score">
              <p>Score X : {xScore}</p>
              <p>Score O : {oScore}</p>
            </div>
          </div>

          {/* Historique des coups */}
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

      {/* ---------- Pied de page ---------- */}
      <footer className="footer" id="contact">
        <p><strong>TIC-TAC-TOE - 2025</strong></p>
        <p>Développé par X</p>
        <p>Contact :<br />GitHub 1<br />GitHub 2</p>
      </footer>
    </>
  );
}


// ---------------------- Fonction utilitaire pour détecter un gagnant ----------------------
function calculateWinner(squares) {
  // Liste des combinaisons gagnantes possibles (lignes, colonnes, diagonales)
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes verticales
    [0, 4, 8], [2, 4, 6],            // Diagonales
  ];

  // Vérifie si une combinaison gagnante est remplie par un même symbole
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c]; // Retourne les indices de la ligne gagnante
    }
  }

  return null; // Pas de gagnant
}
