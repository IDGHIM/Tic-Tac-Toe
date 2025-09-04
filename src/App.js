import { useState, useEffect } from 'react';
import '../src/styles.css';

// ---------------------- Composant Particules Flottantes ----------------------
function FloatingParticles({ theme }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const themeColors = {
    neon: '#00ffff',
    matrix: '#00ff41',
    synthwave: '#ff0080',
    cyberpunk: '#8000ff',
    retro: '#ff8000'
  };

  return (
    <div className="floating-particles">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            backgroundColor: themeColors[theme],
            boxShadow: `0 0 ${particle.size * 2}px ${themeColors[theme]}`,
            animationDuration: `${particle.speed * 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
}

// ---------------------- Composant Sélecteur de Thème ----------------------
function ThemeSelector({ currentTheme, onThemeChange }) {
  const themes = [
    { id: 'neon', name: 'NEON', color: '#00ffff' },
    { id: 'matrix', name: 'MATRIX', color: '#00ff41' },
    { id: 'synthwave', name: 'SYNTHWAVE', color: '#ff0080' },
    { id: 'cyberpunk', name: 'CYBERPUNK', color: '#8000ff' },
    { id: 'retro', name: 'RETRO', color: '#ff8000' }
  ];

  return (
    <div className="theme-selector">
      <span className="theme-label">THEME:</span>
      {themes.map(theme => (
        <button
          key={theme.id}
          className={`theme-btn ${currentTheme === theme.id ? 'active' : ''}`}
          onClick={() => onThemeChange(theme.id)}
          style={{ 
            borderColor: theme.color,
            color: currentTheme === theme.id ? '#000' : theme.color,
            backgroundColor: currentTheme === theme.id ? theme.color : 'transparent',
            boxShadow: currentTheme === theme.id ? `0 0 15px ${theme.color}` : 'none'
          }}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}

// ---------------------- Composant Formulaire Terminal ----------------------
function TerminalContactForm({ theme, isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isTyping, setIsTyping] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    '> INITIALIZING CONTACT PROTOCOL...',
    '> SECURE CONNECTION ESTABLISHED',
    '> READY FOR DATA INPUT'
  ]);

  const themeColors = {
    neon: '#00ffff',
    matrix: '#00ff41',
    synthwave: '#ff0080',
    cyberpunk: '#8000ff',
    retro: '#ff8000'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsTyping(true);
    
    setTerminalLines(prev => [
      ...prev,
      '> PROCESSING DATA...',
      '> ENCRYPTING MESSAGE...',
      '> TRANSMITTING...'
    ]);

    // Simulation d'envoi
    setTimeout(() => {
      setTerminalLines(prev => [
        ...prev,
        '> TRANSMISSION SUCCESSFUL',
        '> CONNECTION TERMINATED'
      ]);
      
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setIsTyping(false);
        setTerminalLines([
          '> INITIALIZING CONTACT PROTOCOL...',
          '> SECURE CONNECTION ESTABLISHED',
          '> READY FOR DATA INPUT'
        ]);
        onClose();
      }, 1500);
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="terminal-overlay" onClick={onClose}>
      <div className="terminal-form" onClick={e => e.stopPropagation()}>
        <div className="terminal-header">
          <span className="terminal-title">SECURE_CONTACT_TERMINAL_v2.0</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="terminal-content">
          <div className="terminal-output">
            {terminalLines.map((line, index) => (
              <div key={index} className="terminal-line" style={{ color: themeColors[theme] }}>
                {line}
              </div>
            ))}
          </div>
          
          {!isTyping && (
            <form onSubmit={handleSubmit} className="terminal-input-form">
              <div className="input-group">
                <label style={{ color: themeColors[theme] }}>&gt; ENTER_NAME:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="terminal-input"
                  style={{ borderColor: themeColors[theme], color: themeColors[theme] }}
                  required
                />
              </div>
              
              <div className="input-group">
                <label style={{ color: themeColors[theme] }}>&gt; ENTER_EMAIL:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="terminal-input"
                  style={{ borderColor: themeColors[theme], color: themeColors[theme] }}
                  required
                />
              </div>
              
              <div className="input-group">
                <label style={{ color: themeColors[theme] }}>&gt; ENTER_MESSAGE:</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="terminal-textarea"
                  style={{ borderColor: themeColors[theme], color: themeColors[theme] }}
                  rows="4"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="terminal-submit"
                style={{ 
                  borderColor: themeColors[theme],
                  color: themeColors[theme],
                  boxShadow: `0 0 10px ${themeColors[theme]}`
                }}
              >
                &gt; TRANSMIT_DATA
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------- Composant Case ----------------------
function Square({ value, onSquareClick, highlight, draw, theme }) {
  const themeColors = {
    neon: '#00ffff',
    matrix: '#00ff41',
    synthwave: '#ff0080',
    cyberpunk: '#8000ff',
    retro: '#ff8000'
  };

  return (
    <button
      className={`square ${highlight ? 'highlight' : ''} ${draw ? 'draw' : ''}`}
      onClick={onSquareClick}
      style={{
        borderColor: highlight ? '#00ff41' : themeColors[theme],
        color: highlight ? '#00ff41' : '#ffffff',
        boxShadow: highlight ? '0 0 30px #00ff41' : `0 0 10px ${themeColors[theme]}`
      }}
    >
      {value}
    </button>
  );
}

// ---------------------- Composant Plateau ----------------------
function Board({ xIsNext, squares, onPlay, theme }) {
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
    ? `${winner} WINS!`
    : isDraw
    ? "SYSTEM_ERROR: DRAW!"
    : `NEXT_PLAYER: ${xIsNext ? 'X' : 'O'}`;

  const themeColors = {
    neon: '#00ffff',
    matrix: '#00ff41',
    synthwave: '#ff0080',
    cyberpunk: '#8000ff',
    retro: '#ff8000'
  };

  return (
    <>
      <div className="status" style={{ 
        color: themeColors[theme],
        borderColor: themeColors[theme],
        textShadow: `0 0 20px ${themeColors[theme]}`,
        boxShadow: `0 0 30px ${themeColors[theme]}`
      }}>
        {status}
      </div>

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
                theme={theme}
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
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const [theme, setTheme] = useState('neon');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [totalGames, setTotalGames] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const themeColors = {
    neon: '#00ffff',
    matrix: '#00ff41',
    synthwave: '#ff0080',
    cyberpunk: '#8000ff',
    retro: '#ff8000'
  };

  // Application du thème à la racine
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeColors[theme]);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  function handlePlay(nextSquares, i) {
    const newHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);

    const winnerLine = calculateWinner(nextSquares);
    if (winnerLine) {
      const winner = nextSquares[winnerLine[0]];
      if (winner === 'X') setXScore(prev => prev + 1);
      if (winner === 'O') setOScore(prev => prev + 1);
      setTotalGames(prev => prev + 1);
    }
    
    // Check for draw
    if (!winnerLine && nextSquares.every(square => square !== null)) {
      setTotalGames(prev => prev + 1);
    }
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    if (move === currentMove) {
      return (
        <li key={move} className="current-move">
          <p>&gt; YOU_ARE_AT_MOVE #{move}</p>
        </li>
      );
    }
    const desc = move ? `&gt; JUMP_TO_MOVE #${move}` : '&gt; RESTART_GAME';
    return (
      <li key={move}>
        <p style={{ color: themeColors[theme] }}>{desc}</p>
      </li>
    );
  });

  const orderedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className={`game-wrapper theme-${theme}`}>
      <FloatingParticles theme={theme} />
      
      {/* Navbar Enhanced */}
      <nav className="navbar-enhanced">
        <div className="navbar-content">
          {/* Logo */}
          <div className="logo-container">
            <h1 className="arcade-logo" style={{ 
              color: themeColors[theme],
              textShadow: `0 0 20px ${themeColors[theme]}`
            }}>
              TIC-TAC-TOE
              <span className="arcade-subtitle">ARCADE</span>
            </h1>
          </div>

          {/* Stats */}
          <div className="game-stats">
            <span className="stat-item" style={{ color: themeColors[theme] }}>
              GAMES: {totalGames}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="desktop-menu">
            <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
            <button 
              className="nav-btn"
              onClick={() => setShowContactForm(true)}
              style={{ 
                borderColor: themeColors[theme],
                color: themeColors[theme]
              }}
            >
              CONTACT
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="hamburger"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{ color: themeColors[theme] }}
          >
            <div className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></div>
            <div className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></div>
            <div className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${showMobileMenu ? 'active' : ''}`}>
          <div className="mobile-stats">
            <span style={{ color: themeColors[theme] }}>GAMES: {totalGames}</span>
          </div>
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <button 
            className="nav-btn mobile"
            onClick={() => {
              setShowContactForm(true);
              setShowMobileMenu(false);
            }}
            style={{ 
              borderColor: themeColors[theme],
              color: themeColors[theme]
            }}
          >
            CONTACT
          </button>
        </div>
      </nav>

      {/* Formulaire de Contact */}
      <TerminalContactForm 
        theme={theme}
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
      />

      {/* Section Règles */}
      <section className="rules-section" id="rules">
        <h2 style={{ 
          color: themeColors[theme],
          textShadow: `0 0 20px ${themeColors[theme]}`
        }}>
          GAME_PROTOCOL
        </h2>
        <ul>
          <li><span style={{ color: themeColors[theme] }}>&gt;</span> TWO_PLAYERS: X AND O</li>
          <li><span style={{ color: themeColors[theme] }}>&gt;</span> ALTERNATING_TURNS ON 3x3 GRID</li>
          <li><span style={{ color: themeColors[theme] }}>&gt;</span> ALIGN_3_SYMBOLS TO WIN</li>
          <li><span style={{ color: themeColors[theme] }}>&gt;</span> FULL_GRID = SYSTEM_DRAW</li>
        </ul>
      </section>

      {/* Conteneur principal du jeu */}
      <div className="game-container" id="game">
        <div className="game-layout">
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} theme={theme} />

            <div className="controls-container">
              <button
                id="restart-btn"
                onClick={restartGame}
                style={{ 
                  borderColor: themeColors[theme],
                  color: themeColors[theme],
                  boxShadow: `0 0 20px ${themeColors[theme]}`
                }}
              >
                SYSTEM_RESTART
              </button>

              <div className="score-center">
                <div className="score" style={{ 
                  borderColor: themeColors[theme],
                  boxShadow: `0 0 20px ${themeColors[theme]}`
                }}>
                  <p style={{ color: themeColors[theme] }}>PLAYER_X: {xScore}</p>
                  <p style={{ color: themeColors[theme] }}>PLAYER_O: {oScore}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="game-info">
            <div className="terminal-header" style={{ color: themeColors[theme] }}>
              &gt; GAME_HISTORY.LOG
            </div>
            <button
              onClick={() => setIsAscending(!isAscending)}
              className="sort-btn"
              style={{ 
                borderColor: themeColors[theme],
                color: themeColors[theme]
              }}
            >
              SORT: {isAscending ? 'ASC' : 'DESC'}
            </button>
            <ol className="move-list">{orderedMoves}</ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" id="contact">
        <p><strong>TIC-TAC-TOE ARCADE - 2025</strong></p>
        <p style={{ color: themeColors[theme] }}>
          &gt; DEVELOPED_BY{' '}
          <a href="https://github.com/IDGHIM" target="_blank" rel="noopener noreferrer">ICHEM</a>{' '}
          <a href="https://github.com/lfourage" target="_blank" rel="noopener noreferrer">LUDO</a>{' '}
          <a href="https://github.com/Snoobydoo" target="_blank" rel="noopener noreferrer">THÉO</a>{' '}
          <a href="https://github.com/Kroxii" target="_blank" rel="noopener noreferrer">RÉMI</a>{' '}
          <a href="https://github.com/nicolas-drew" target="_blank" rel="noopener noreferrer">NICO</a>{' '}
          <a href="https://github.com/calypsohebrard" target="_blank" rel="noopener noreferrer">CALYPSO</a>{' '}
          <a href="https://github.com/4749-am" target="_blank" rel="noopener noreferrer">ANNE-MARIE</a>
        </p>
      </footer>
    </div>
  );
}

// ---------------------- Fonction de détection du gagnant ----------------------
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes verticales
    [0, 4, 8], [2, 4, 6],            // diagonales
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }

  return null;
}