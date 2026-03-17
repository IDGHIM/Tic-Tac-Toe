import { useState, useEffect, useRef } from 'react';
import '../src/styles.css';

/* ══════════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════════ */

const THEMES = [
  { id: 'gold',   name: 'GOLD',   acc: '#f0c040', acc2: '#ff8800' },
  { id: 'coral',  name: 'CORAL',  acc: '#ff4d6d', acc2: '#ff9966' },
  { id: 'ice',    name: 'ICE',    acc: '#64dfdf', acc2: '#48bfe3' },
  { id: 'violet', name: 'VIOLET', acc: '#c77dff', acc2: '#e040fb' },
  { id: 'lime',   name: 'LIME',   acc: '#b5e550', acc2: '#39d353' },
];

const GRID_SIZES = [
  { size: 3, win: 3, label: '3×3' },
  { size: 4, win: 4, label: '4×4' },
  { size: 5, win: 5, label: '5×5' },
];

const BEST_OF_OPTIONS  = [1, 3, 5];
const TIMER_OPTIONS    = [0, 10, 15, 30];
const AI_LEVELS        = [
  { id: 'easy',   label: 'EASY'   },
  { id: 'medium', label: 'MEDIUM' },
  { id: 'hard',   label: 'HARD'   },
];

/* ══════════════════════════════════════════════════════════
   AUDIO  (Web Audio API — zéro dépendance)
══════════════════════════════════════════════════════════ */

class AudioEngine {
  constructor() { this.ctx = null; this.on = true; }
  _ctx() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this.ctx;
  }
  _beep(freq, dur, type = 'square', vol = 0.08) {
    if (!this.on) return;
    try {
      const ctx = this._ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch {}
  }
  click()  { this._beep(440,  0.05); }
  place()  { this._beep(660,  0.09); }
  tick()   { this._beep(880,  0.04, 'square', 0.05); }
  urgent() { this._beep(1300, 0.04, 'square', 0.09); setTimeout(() => this._beep(1300, 0.04, 'square', 0.09), 90); }
  draw()   { [300,250,200].forEach((f,i) => setTimeout(() => this._beep(f, 0.13, 'sawtooth', 0.07), i*80)); }
  win()    { [523,659,784,1047].forEach((f,i) => setTimeout(() => this._beep(f, 0.16, 'square', 0.1), i*90)); }
  trophy() { [523,523,659,523,784,740].forEach((f,i) => setTimeout(() => this._beep(f, 0.2, 'square', 0.1), i*120)); }
}

const sfx = new AudioEngine();

/* ══════════════════════════════════════════════════════════
   LOGIQUE JEU
══════════════════════════════════════════════════════════ */

const mkBoard = (size) => Array(size * size).fill(null);

function calcWinner(sq, size, win) {
  const at = (r, c) => r * size + c;
  const check = cells => {
    if (cells.some(i => !sq[i])) return null;
    const v = sq[cells[0]];
    return cells.every(i => sq[i] === v) ? cells : null;
  };
  for (let r = 0; r < size; r++)
    for (let c = 0; c <= size - win; c++) {
      const res = check(Array.from({length: win}, (_, k) => at(r, c+k)));
      if (res) return res;
    }
  for (let c = 0; c < size; c++)
    for (let r = 0; r <= size - win; r++) {
      const res = check(Array.from({length: win}, (_, k) => at(r+k, c)));
      if (res) return res;
    }
  for (let r = 0; r <= size - win; r++)
    for (let c = 0; c <= size - win; c++) {
      const res = check(Array.from({length: win}, (_, k) => at(r+k, c+k)));
      if (res) return res;
    }
  for (let r = 0; r <= size - win; r++)
    for (let c = win-1; c < size; c++) {
      const res = check(Array.from({length: win}, (_, k) => at(r+k, c-k)));
      if (res) return res;
    }
  return null;
}

/* Minimax + alpha-beta */
function minimax(sq, depth, isMax, α, β, size, win, aiSym, huSym, maxD) {
  const wl = calcWinner(sq, size, win);
  if (wl) return sq[wl[0]] === aiSym ? 100 - depth : depth - 100;
  const empty = sq.reduce((a, v, i) => v === null ? [...a, i] : a, []);
  if (!empty.length || depth >= maxD) return 0;
  if (isMax) {
    let best = -Infinity;
    for (const i of empty) {
      sq[i] = aiSym;
      best = Math.max(best, minimax(sq, depth+1, false, α, β, size, win, aiSym, huSym, maxD));
      sq[i] = null; α = Math.max(α, best);
      if (β <= α) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of empty) {
      sq[i] = huSym;
      best = Math.min(best, minimax(sq, depth+1, true, α, β, size, win, aiSym, huSym, maxD));
      sq[i] = null; β = Math.min(β, best);
      if (β <= α) break;
    }
    return best;
  }
}

function aiMove(sq, size, win, level, ai, hu) {
  const empty = sq.reduce((a, v, i) => v === null ? [...a, i] : a, []);
  if (!empty.length) return -1;
  if (level === 'easy') return empty[Math.floor(Math.random() * empty.length)];
  if (level === 'medium') {
    for (const i of empty) { sq[i] = ai; if (calcWinner(sq,size,win)) { sq[i]=null; return i; } sq[i]=null; }
    for (const i of empty) { sq[i] = hu; if (calcWinner(sq,size,win)) { sq[i]=null; return i; } sq[i]=null; }
    return empty[Math.floor(Math.random() * empty.length)];
  }
  const maxD = size===3 ? 9 : size===4 ? 4 : 3;
  let best = -Infinity, move = empty[0];
  for (const i of empty) {
    sq[i] = ai;
    const s = minimax(sq, 0, false, -Infinity, Infinity, size, win, ai, hu, maxD);
    sq[i] = null;
    if (s > best) { best = s; move = i; }
  }
  return move;
}

/* ══════════════════════════════════════════════════════════
   COMPOSANTS
══════════════════════════════════════════════════════════ */

function FloatingParticles({ color }) {
  const pts = useRef(Array.from({length:36}, (_,i) => ({
    id: i, x: Math.random()*100, y: Math.random()*100+10,
    size: Math.random()*2.4+0.8, dur: Math.random()*14+8, delay: Math.random()*10,
  }))).current;
  return (
    <div className="floating-particles">
      {pts.map(p => (
        <div key={p.id} className="particle" style={{
          left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size,
          backgroundColor:color, boxShadow:`0 0 ${p.size*4}px ${color}`,
          animationDuration:`${p.dur}s`, animationDelay:`${p.delay}s`,
        }}/>
      ))}
    </div>
  );
}

function ThemeSelector({ cur, onChange }) {
  return (
    <div className="theme-selector">
      <span className="theme-label">PALETTE</span>
      {THEMES.map(t => (
        <button key={t.id}
          className={`theme-btn${cur===t.id?' active':''}`}
          onClick={() => { sfx.click(); onChange(t.id); }}
          style={cur===t.id
            ? {background:t.acc,borderColor:t.acc,color:'#0d0714',boxShadow:`0 0 14px ${t.acc}`}
            : {borderColor:'rgba(255,255,255,0.12)',color:t.acc}}>
          {t.name}
        </button>
      ))}
    </div>
  );
}

function ScoreFlyout({ trigger, color }) {
  const [ids, setIds] = useState([]);
  const prev = useRef(trigger);
  useEffect(() => {
    if (trigger !== prev.current) {
      prev.current = trigger;
      const id = Date.now();
      setIds(p => [...p, id]);
      setTimeout(() => setIds(p => p.filter(x => x !== id)), 1000);
    }
  }, [trigger]);
  return <>{ids.map(id => <span key={id} className="score-flyout" style={{color,textShadow:`0 0 12px ${color}`}}>+1</span>)}</>;
}

function TimerBar({ left, max, color }) {
  if (!max) return null;
  const pct  = (left / max) * 100;
  const urg  = left <= 5;
  const c    = urg ? '#ff4d6d' : color;
  return (
    <div className="timer-wrap">
      <div className="timer-bg">
        <div className="timer-fill" style={{width:`${pct}%`,background:c,boxShadow:`0 0 10px ${c}`}}/>
      </div>
      <span className="timer-label" style={{color:c}}>{left}s</span>
    </div>
  );
}

function TournBadge({ xW, oW, bestOf, acc, acc2 }) {
  const need = Math.ceil(bestOf/2);
  return (
    <div className="tourn-badge">
      <span className="tourn-label">BEST OF {bestOf}</span>
      <div className="tourn-pips">
        {Array.from({length:need}).map((_,i) => (
          <div key={`x${i}`} className={`pip${i<xW?' filled':''}`}
            style={{borderColor:acc, background:i<xW?acc:'transparent'}}/>
        ))}
        <span className="tourn-vs">VS</span>
        {Array.from({length:need}).map((_,i) => (
          <div key={`o${i}`} className={`pip${i<oW?' filled':''}`}
            style={{borderColor:acc2, background:i<oW?acc2:'transparent'}}/>
        ))}
      </div>
    </div>
  );
}

function EndScreen({ winner, xW, oW, bestOf, onRematch, onNew, acc, acc2, gameMode, aiLevel }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 60); }, []);

  const need   = Math.ceil(bestOf/2);
  const tournW = xW >= need ? 'X' : oW >= need ? 'O' : null;
  const mainC  = (tournW||winner)==='X' ? acc : (tournW||winner)==='O' ? acc2 : '#7a6e88';
  const title  = tournW ? `${tournW} WINS THE TOURNAMENT`
               : winner ? `${winner} WINS` : 'DRAW';
  const sub    = tournW ? `${xW} — ${oW} in best of ${bestOf}`
               : gameMode==='solo'&&winner==='O' ? `CPU (${aiLevel?.toUpperCase()}) wins this round` : null;

  return (
    <div className={`end-overlay${show?' visible':''}`}>
      <div className="end-card" style={{borderColor:mainC, boxShadow:`0 0 70px ${mainC}30, 0 0 140px ${mainC}15`}}>
        <div className="confetti-wrap">
          {Array.from({length:28}).map((_,i) => (
            <div key={i} className="confetti-piece" style={{
              left:`${Math.random()*100}%`,
              background: i%3===0 ? acc : i%3===1 ? acc2 : '#ffffff22',
              animationDelay:`${Math.random()*0.5}s`,
              animationDuration:`${0.7+Math.random()*0.7}s`,
              width: 6+Math.random()*6,
              height: 6+Math.random()*6,
            }}/>
          ))}
        </div>
        <div className="end-trophy" style={{color:mainC, textShadow:`0 0 40px ${mainC}`}}>
          {tournW ? '◈' : winner ? '⬡' : '◇'}
        </div>
        <h2 className="end-title" style={{color:mainC, textShadow:`0 0 30px ${mainC}`}}>{title}</h2>
        {sub && <p className="end-sub">{sub}</p>}
        <div className="end-score-row">
          <div className="end-score-item" style={{color:acc}}>
            <span className="end-sym">X</span>
            <span className="end-num">{xW}</span>
          </div>
          <span className="end-sep">—</span>
          <div className="end-score-item" style={{color:acc2}}>
            <span className="end-sym">O</span>
            <span className="end-num">{oW}</span>
          </div>
        </div>
        <div className="end-actions">
          {!tournW && (
            <button className="end-btn primary" onClick={onRematch}
              style={{borderColor:mainC,color:mainC,boxShadow:`0 0 18px ${mainC}40`}}>
              REMATCH
            </button>
          )}
          <button className="end-btn secondary" onClick={onNew}>NEW TOURNAMENT</button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ settings, onChange, onClose, acc }) {
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <span style={{color:acc,fontFamily:'var(--font-disp)',letterSpacing:'0.15em',fontSize:'1.1rem'}}>
            GAME SETTINGS
          </span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Mode */}
        <div className="sgroup">
          <label className="slabel" style={{color:acc}}>◆ MODE</label>
          <div className="srow">
            {[{id:'2p',lbl:'2 PLAYERS'},{id:'solo',lbl:'VS CPU'}].map(m => (
              <button key={m.id} className={`sbtn${settings.gameMode===m.id?' active':''}`}
                onClick={() => onChange('gameMode', m.id)}
                style={settings.gameMode===m.id
                  ? {background:acc,borderColor:acc,color:'#0d0714'}
                  : {borderColor:`${acc}35`,color:'#7a6e88'}}>
                {m.lbl}
              </button>
            ))}
          </div>
        </div>

        {settings.gameMode==='solo' && (
          <div className="sgroup">
            <label className="slabel" style={{color:acc}}>◆ DIFFICULTY</label>
            <div className="srow">
              {AI_LEVELS.map(l => (
                <button key={l.id} className={`sbtn${settings.aiLevel===l.id?' active':''}`}
                  onClick={() => onChange('aiLevel', l.id)}
                  style={settings.aiLevel===l.id
                    ? {background:acc,borderColor:acc,color:'#0d0714'}
                    : {borderColor:`${acc}35`,color:'#7a6e88'}}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="sgroup">
          <label className="slabel" style={{color:acc}}>◆ GRID SIZE</label>
          <div className="srow">
            {GRID_SIZES.map(g => (
              <button key={g.size} className={`sbtn${settings.gridSize===g.size?' active':''}`}
                onClick={() => onChange('gridSize', g.size)}
                style={settings.gridSize===g.size
                  ? {background:acc,borderColor:acc,color:'#0d0714'}
                  : {borderColor:`${acc}35`,color:'#7a6e88'}}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Best of */}
        <div className="sgroup">
          <label className="slabel" style={{color:acc}}>◆ BEST OF</label>
          <div className="srow">
            {BEST_OF_OPTIONS.map(b => (
              <button key={b} className={`sbtn${settings.bestOf===b?' active':''}`}
                onClick={() => onChange('bestOf', b)}
                style={settings.bestOf===b
                  ? {background:acc,borderColor:acc,color:'#0d0714'}
                  : {borderColor:`${acc}35`,color:'#7a6e88'}}>
                {b===1?'CLASSIC':`BEST OF ${b}`}
              </button>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="sgroup">
          <label className="slabel" style={{color:acc}}>◆ TIMER / TURN</label>
          <div className="srow">
            {TIMER_OPTIONS.map(t => (
              <button key={t} className={`sbtn${settings.timerSec===t?' active':''}`}
                onClick={() => onChange('timerSec', t)}
                style={settings.timerSec===t
                  ? {background:acc,borderColor:acc,color:'#0d0714'}
                  : {borderColor:`${acc}35`,color:'#7a6e88'}}>
                {t===0?'OFF':`${t}s`}
              </button>
            ))}
          </div>
        </div>

        <button className="apply-btn" onClick={onClose}
          style={{background:acc,color:'#0d0714',borderColor:acc}}>
          APPLY &amp; RESTART
        </button>
      </div>
    </div>
  );
}

function Square({ val, onClick, hl, draw, acc, acc2 }) {
  return (
    <button
      className={`square${hl?' hl':''}${draw?' draw':''}`}
      onClick={onClick}
      style={{
        borderColor: hl ? acc : `${acc}22`,
        color: val==='X' ? acc : val==='O' ? acc2 : 'transparent',
      }}>
      {val}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, gridSize, winLen, acc, acc2, disabled }) {
  const wl   = calcWinner(squares, gridSize, winLen);
  const win  = wl ? squares[wl[0]] : null;
  const draw = !win && squares.every(Boolean);

  function click(i) {
    if (disabled || win || draw || squares[i]) return;
    sfx.place();
    const next = squares.slice(); next[i] = xIsNext ? 'X' : 'O';
    onPlay(next);
  }

  const stC = win ? (win==='X' ? acc : acc2) : draw ? '#7a6e88' : xIsNext ? acc : acc2;
  const stT = win ? `${win}  WINS` : draw ? 'DRAW' : `TURN  ·  ${xIsNext?'X':'O'}`;

  return (
    <>
      <div className="status" style={{color:stC,borderColor:`${stC}35`,textShadow:`0 0 20px ${stC}`}}>
        {stT}
      </div>
      <div className="board-grid" style={{'--gs': gridSize}}>
        {squares.map((v,i) => (
          <Square key={i} val={v} onClick={() => click(i)}
            hl={wl?.includes(i)} draw={draw} acc={acc} acc2={acc2}/>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════════ */

export default function Game() {
  const [theme,   setTheme]   = useState('gold');
  const [soundOn, setSoundOn] = useState(true);
  const [mobOpen, setMobOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);

  const [settings, setSettings] = useState({
    gameMode: '2p', aiLevel: 'hard',
    gridSize: 3, bestOf: 1, timerSec: 0,
  });

  const [squares,  setSquares]  = useState(() => mkBoard(3));
  const [xIsNext,  setXIsNext]  = useState(true);
  const [xW,       setXW]       = useState(0);
  const [oW,       setOW]       = useState(0);
  const [total,    setTotal]    = useState(0);
  const [xTrig,    setXTrig]    = useState(0);
  const [oTrig,    setOTrig]    = useState(0);
  const [roundEnd, setRoundEnd] = useState(false);
  const [showEnd,  setShowEnd]  = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef(null);
  const { acc, acc2 } = THEMES.find(t => t.id === theme);
  const { gameMode, aiLevel, gridSize, bestOf, timerSec } = settings;
  const winLen = GRID_SIZES.find(g => g.size === gridSize)?.win ?? 3;

  /* CSS vars */
  useEffect(() => {
    document.documentElement.style.setProperty('--acc',  acc);
    document.documentElement.style.setProperty('--acc2', acc2);
    document.body.className = `theme-${theme}`;
  }, [theme, acc, acc2]);

  useEffect(() => { sfx.on = soundOn; }, [soundOn]);

  /* Reset quand settings changent */
  useEffect(() => {
    setSquares(mkBoard(settings.gridSize));
    setXIsNext(true); setRoundEnd(false); setShowEnd(false);
    setXW(0); setOW(0); setTotal(0);
  }, [settings.gridSize, settings.gameMode, settings.bestOf, settings.aiLevel]);

  /* Timer reset au changement de tour */
  useEffect(() => {
    if (!timerSec || roundEnd) { clearInterval(timerRef.current); return; }
    setTimeLeft(timerSec);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          clearInterval(timerRef.current);
          sfx.urgent();
          setXIsNext(x => !x);
          return timerSec;
        }
        if (p <= 5) sfx.urgent(); else sfx.tick();
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [xIsNext, timerSec, roundEnd]);

  /* IA */
  useEffect(() => {
    if (gameMode !== 'solo' || xIsNext || roundEnd) return;
    const wl = calcWinner(squares, gridSize, winLen);
    if (wl || squares.every(Boolean)) return;
    const delay = aiLevel==='easy' ? 350 : aiLevel==='medium' ? 550 : 450;
    const t = setTimeout(() => {
      const move = aiMove(squares.slice(), gridSize, winLen, aiLevel, 'O', 'X');
      if (move < 0) return;
      const next = squares.slice(); next[move] = 'O';
      sfx.place();
      resolvePlay(next);
    }, delay);
    return () => clearTimeout(t);
  }, [xIsNext, squares, gameMode, roundEnd]);

  function resolvePlay(next) {
    setSquares(next);
    const wl   = calcWinner(next, gridSize, winLen);
    const isDr = !wl && next.every(Boolean);

    if (wl || isDr) {
      clearInterval(timerRef.current);
      setRoundEnd(true);
      setTotal(n => n+1);
      let nx = xW, no = oW;
      if (wl) {
        const w = next[wl[0]];
        if (w==='X') { nx=xW+1; setXW(nx); setXTrig(n=>n+1); sfx.win(); }
        else          { no=oW+1; setOW(no); setOTrig(n=>n+1); sfx.win(); }
      } else { sfx.draw(); }

      const need = Math.ceil(bestOf/2);
      const over = nx>=need || no>=need;
      if (over) { sfx.trophy(); setTimeout(() => setShowEnd(true), 700); }
      else if (bestOf>1) setTimeout(() => setShowEnd(true), 600);
    } else {
      setXIsNext(x => !x);
    }
  }

  function startNext() {
    setSquares(mkBoard(gridSize)); setXIsNext(true);
    setRoundEnd(false); setShowEnd(false);
    if (timerSec) setTimeLeft(timerSec);
  }

  function newTournament() {
    setSquares(mkBoard(gridSize)); setXIsNext(true);
    setRoundEnd(false); setShowEnd(false);
    setXW(0); setOW(0); setTotal(0);
  }

  function changeSetting(key, val) {
    sfx.click();
    setSettings(p => ({ ...p, [key]: val }));
  }

  const aiThinking = gameMode==='solo' && !xIsNext && !roundEnd;

  return (
    <div className={`game-wrapper theme-${theme}`}>
      <FloatingParticles color={acc}/>

      {/* NAVBAR */}
      <nav className="navbar-enhanced">
        <div className="navbar-content">
          <div className="logo-container">
            <h1 className="arcade-logo" style={{color:acc,textShadow:`0 0 28px ${acc}`}}>
              TIC-TAC-TOE
              <span className="arcade-subtitle">ARCADE EDITION</span>
            </h1>
          </div>

          <div className="game-stats">
            <span className="stat-item" style={{borderColor:`${acc}30`,color:acc}}>GAMES&nbsp;{total}</span>
          </div>

          <div className="desktop-menu">
            <ThemeSelector cur={theme} onChange={setTheme}/>
            <button className="nav-btn"
              onClick={() => { sfx.click(); setSoundOn(s=>!s); }}
              style={{borderColor:`${acc}55`,color:soundOn?acc:'#7a6e88'}}>
              {soundOn?'♪ ON':'♪ OFF'}
            </button>
            <button className="nav-btn"
              onClick={() => { sfx.click(); setSetOpen(true); }}
              style={{borderColor:acc,color:acc}}>
              ⚙ SETTINGS
            </button>
          </div>

          <button className="hamburger" onClick={() => setMobOpen(o=>!o)}>
            {[0,1,2].map(i => <div key={i} className="hamburger-line" style={{background:acc,boxShadow:`0 0 6px ${acc}`}}/>)}
          </button>
        </div>

        {mobOpen && (
          <div className="mobile-menu active">
            <ThemeSelector cur={theme} onChange={setTheme}/>
            <div style={{display:'flex',gap:8}}>
              <button className="nav-btn mobile"
                onClick={() => { sfx.click(); setSoundOn(s=>!s); }}
                style={{borderColor:`${acc}55`,color:soundOn?acc:'#7a6e88',flex:1}}>
                {soundOn?'♪ ON':'♪ OFF'}
              </button>
              <button className="nav-btn mobile"
                onClick={() => { sfx.click(); setSetOpen(true); setMobOpen(false); }}
                style={{borderColor:acc,color:acc,flex:1}}>
                ⚙ SETTINGS
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* SETTINGS MODAL */}
      {setOpen && (
        <SettingsModal settings={settings} onChange={changeSetting} onClose={() => setSetOpen(false)} acc={acc}/>
      )}

      {/* END SCREEN */}
      {showEnd && (
        <EndScreen
          winner={(() => { const wl=calcWinner(squares,gridSize,winLen); return wl?squares[wl[0]]:null; })()}
          xW={xW} oW={oW} bestOf={bestOf}
          onRematch={startNext} onNew={newTournament}
          acc={acc} acc2={acc2}
          gameMode={gameMode} aiLevel={aiLevel}
        />
      )}

      {/* GAME */}
      <div className="game-container">
        <div className="game-layout">
          <div className="game-board-col">

            {bestOf > 1 && <TournBadge xW={xW} oW={oW} bestOf={bestOf} acc={acc} acc2={acc2}/>}

            {aiThinking && (
              <div className="ai-thinking" style={{color:acc2}}>
                <span className="ai-dot"/><span className="ai-dot"/><span className="ai-dot"/>
                CPU THINKING…
              </div>
            )}

            {timerSec > 0 && !roundEnd && (
              <TimerBar left={timeLeft} max={timerSec} color={xIsNext ? acc : acc2}/>
            )}

            <Board
              xIsNext={xIsNext} squares={squares} onPlay={resolvePlay}
              gridSize={gridSize} winLen={winLen}
              acc={acc} acc2={acc2}
              disabled={aiThinking || roundEnd}
            />

            <div className="controls-container">
              <button id="restart-btn" onClick={newTournament}
                style={{borderColor:acc2,color:acc2}}>
                RESTART
              </button>
              {roundEnd && !showEnd && (
                <button id="next-btn" onClick={startNext}
                  style={{borderColor:acc,color:acc,boxShadow:`0 0 16px ${acc}40`}}>
                  NEXT ROUND →
                </button>
              )}
              <div className="score-center">
                <div className="score" style={{borderColor:`${acc}20`}}>
                  <p style={{color:acc,position:'relative'}}>
                    {gameMode==='solo'?'PLAYER':'PLAYER X'}&nbsp;&nbsp;{xW}
                    <ScoreFlyout trigger={xTrig} color={acc}/>
                  </p>
                  <p style={{color:acc2,position:'relative'}}>
                    {gameMode==='solo'?`CPU (${aiLevel.toUpperCase()})`:'PLAYER O'}&nbsp;&nbsp;{oW}
                    <ScoreFlyout trigger={oTrig} color={acc2}/>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="game-info">
            <div className="terminal-header" style={{color:acc}}>◆ GAME INFO</div>
            <div className="info-block">
              {[
                ['MODE',   gameMode==='solo'?'VS CPU':'2 PLAYERS'],
                ...(gameMode==='solo' ? [['LEVEL', aiLevel.toUpperCase()]] : []),
                ['GRID',   GRID_SIZES.find(g=>g.size===gridSize)?.label],
                ['FORMAT', bestOf===1?'CLASSIC':`BEST OF ${bestOf}`],
                ['TIMER',  timerSec===0?'OFF':`${timerSec}s / turn`],
              ].map(([k,v]) => (
                <div key={k} className="info-row">
                  <span className="info-key">{k}</span>
                  <span className="info-val" style={{color:acc}}>{v}</span>
                </div>
              ))}
            </div>

            <div className="terminal-header" style={{color:acc,marginTop:2}}>◆ RULES</div>
            <ul className="rules-list">
              {[
                `Align ${winLen} symbols to win`,
                gameMode==='solo'?`X = you · O = CPU (${aiLevel})`:'X goes first — alternate',
                bestOf>1?`${Math.ceil(bestOf/2)} wins to take the trophy`:'Single game',
                timerSec?`${timerSec}s per turn — or skip`:'No turn limit',
              ].map((r,i) => (
                <li key={i}><span style={{color:acc}}>◆</span> {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p><strong>TIC-TAC-TOE ARCADE — 2025</strong></p>
        <p>
          {[
            {name:'ICHEM',     url:'https://github.com/IDGHIM'},
            {name:'LUDO',      url:'https://github.com/lfourage'},
            {name:'THÉO',      url:'https://github.com/Snoobydoo'},
            {name:'RÉMI',      url:'https://github.com/Kroxii'},
            {name:'NICO',      url:'https://github.com/nicolas-drew'},
            {name:'CALYPSO',   url:'https://github.com/calypsohebrard'},
            {name:'ANNE-MARIE',url:'https://github.com/4749-am'},
          ].map(({name,url}) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}</a>
          ))}
        </p>
      </footer>
    </div>
  );
}