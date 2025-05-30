// Importation de la fonction useState de React pour la gestion d'états locaux
import { useState } from 'react';
// Importation du fichier CSS pour les styles
import './styles.css';


// ---------------------- Composant Case ----------------------
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


// ---------------------- Composant Plateau ----------------------
function Board({ xIsNext, squares, onPlay }) {
  // Gestion du clic sur une case
  function handleClick(i) {
    // Empêche le clic si un gagnant existe ou si la case est déjà remplie
    if (calculateWinner(squares) || squares[i]) return;

    // Copie du tableau des cases pour mise à jour
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  // Détecte la ligne gagnante (indices des cases)
  const winningLine = calculateWinner(squares);
  // Détermine le gagnant s'il y en a un
  const winner = winningLine ? squares[winningLine[0]] : null;
  // Vérifie s'il y a match nul (toutes les cases remplies sans gagnant)
  const isDraw = !winner && squares.every(square => square !== null);

  // Message de statut selon situation
  const status = winner
    ? `${winner} a gagné`
    : isDraw
    ? "Match nul !"
    : `Prochain tour : ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className="status">{status}</div>

      {/* Création des lignes et colonnes du plateau */}
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


// ---------------------- Composant Principal ----------------------
export default function Game() {
  // Historique des états du plateau
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // Coup actuel dans l'historique
  const [currentMove, setCurrentMove] = useState(0);
  // Scores des joueurs X et O
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  // Ordre d'affichage de l'historique (ascendant ou descendant)
  const [isAscending, setIsAscending] = useState(true);

  // Détermine quel joueur doit jouer (X si pair, O sinon)
  const xIsNext = currentMove % 2 === 0;
  // Plateau à l'état actuel
  const currentSquares = history[currentMove];

  // Gestion d'un nouveau coup joué
  function handlePlay(nextSquares, i) {
    // Mise à jour de l'historique jusqu'au coup actuel + ajout du nouveau coup
    const newHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);

    // Si on détecte un gagnant, on incrémente le score correspondant
    const winnerLine = calculateWinner(nextSquares);
    if (winnerLine) {
      const winner = nextSquares[winnerLine[0]];
      if (winner === 'X') setXScore(prev => prev + 1);
      if (winner === 'O') setOScore(prev => prev + 1);
    }
  }

  // Fonction pour revenir à un coup précédent
  function jumpTo(move) {
    setCurrentMove(move);
  }

  // Création de la liste des coups joués (non cliquables)
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
        <p>{desc}</p> {/* Texte non cliquable */}
      </li>
    );
  });

  // Trie les coups selon l'ordre choisi (ascendant ou descendant)
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

            {/* Conteneur flex pour aligner bouton Restart et score côte à côte */}
            <div className="controls-container">
              {/* Bouton restart pour réinitialiser le jeu */}
              <button
                id="restart-btn"
                onClick={() => {
                  setHistory([Array(9).fill(null)]);
                  setCurrentMove(0);
                }}
              >
                Restart
              </button>

              {/* Affichage du score des joueurs */}
              <div className="score-center">
                <div className="score">
                  <p>Score X : {xScore}</p>
                  <p>Score O : {oScore}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des coups (non interactif) */}
          <div className="game-info">
            {/* Bouton pour inverser l'ordre de l'historique */}
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
        <p>Développé par Ichem / Ludo / Théo / Rémi / Nico / Calpyso / Anne-Marie</p>
        <p>Contact :<br />
          <a href="https://github.com/IDGHIM" target="_blank" rel="noopener noreferrer">GitHub Ichem</a><br />
          <a href="https://github.com/lfourage" target="_blank" rel="noopener noreferrer">GitHub Ludo</a><br />
          <a href="https://github.com/Snoobydoo" target="_blank" rel="noopener noreferrer">GitHub Théo</a><br />
          <a href="https://github.com/Kroxii" target="_blank" rel="noopener noreferrer">GitHub Rémi</a><br />
          <a href="https://github.com/nicolas-drew" target="_blank" rel="noopener noreferrer">GitHub Nico</a><br />
          <a href="https://github.com/calypsohebrard" target="_blank" rel="noopener noreferrer">GitHub Calypso</a><br />
          <a href="https://github.com/4749-am" target="_blank" rel="noopener noreferrer">GitHub Anne-Marie</a><br />
        </p>
      </footer>
    </>
  );
}


// ---------------------- Fonction de détection du gagnant ----------------------
function calculateWinner(squares) {
  // Toutes les combinaisons gagnantes possibles
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes verticales
    [0, 4, 8], [2, 4, 6],            // diagonales
  ];

  // Vérifie chaque combinaison pour un gagnant
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c]; // Retourne la ligne gagnante
    }
  }

  return null; // Pas de gagnant trouvé
}
