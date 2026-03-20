import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Swords, Zap, Search, Code, Terminal, Bug, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/audioEngine';

const PROG_QUESTIONS = [
  {
    lang: 'JavaScript',
    text: 'const x = [1, 2, 3]; x[10] = 5; console.log(x.length);',
    options: ['3', '11', '10', 'undefined'],
    correct: '11',
    explanation: 'MECHANICS: In JS, arrays are objects with a length property. Setting an index higher than length creates "empty slots" (holes) and automatically updates the length to index + 1.'
  },
  {
    lang: 'Python',
    text: 'def func(a, b=[]): b.append(a); return b\nprint(func(1)); print(func(2))',
    options: ['[1] [2]', '[1] [1, 2]', '[1, 2] [1, 2]', 'Error'],
    correct: '[1] [1, 2]',
    explanation: 'PERSISTENCE: Python default arguments are instantiated once at definition time. The list [ ] is shared across all function calls, making it an accidental "static" variable.'
  },
  {
    lang: 'CSS (Box Model)',
    text: '.container { width: 100px; padding: 10px; border: 5px solid; box-sizing: content-box; }\nWhat is the total rendered width?',
    options: ['100px', '115px', '130px', '110px'],
    correct: '130px',
    explanation: 'CALCULATION: content-box (default) adds padding and border OUTSIDE the width. Total = 100(w) + 10*2(p) + 5*2(b) = 130px.'
  },
  {
    lang: 'Bug Hunt (Hoisting)',
    text: 'console.log(a);\nvar a = 5;\nfunction test() {\n  console.log(a);\n  var a = 10;\n}',
    options: ['5, undefined', 'undefined, 5', 'undefined, undefined', 'Error'],
    correct: 'undefined, undefined',
    explanation: 'SHADOWING: The "var a" inside the function is hoisted to the top of the function scope, shadowing the outer "a" and making it undefined at the time of the log.'
  },
  {
    lang: 'Error Discovery',
    text: 'const user = { id: 1 };\nconst proxy = new Proxy(user, {\n  get: (target, prop) => "Hacked!"\n});\nconsole.log(proxy.id);',
    options: ['1', 'Hacked!', 'undefined', 'ReferenceError'],
    correct: 'Hacked!',
    explanation: 'INTERCEPTION: Proxies allow you to define custom behavior for fundamental operations. The "get" trap intercepts all property access, regardless of the original value.'
  }
];

const Arena = () => {
  const { user, addXP, addCurrency } = useContext(UserContext);
  const [matchState, setMatchState] = useState('idle'); // idle | searching | matched | battling | results
  const [opponent, setOpponent] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [matchLog, setMatchLog] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const OPPONENTS = [
    { name: 'NeonKnight', avatar: '🛡️', skill: 0.7 },
    { name: 'CyberShark', avatar: '🦈', skill: 0.85 },
    { name: 'ByteNinja', avatar: '🥷', skill: 0.6 },
    { name: 'Dr0id', avatar: '🤖', skill: 0.95 }
  ];

  const startSearch = () => {
    sfx.click();
    setMatchState('searching');
    setTimeout(() => {
      setOpponent(OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)]);
      setMatchState('matched');
      sfx.levelUp();
    }, 2000);
  };

  const startBattle = () => {
    sfx.click();
    setMatchState('battling');
    setPlayerScore(0);
    setOpponentScore(0);
    nextRound();
  };

  const nextRound = () => {
    setShowExplanation(false);
    const q = PROG_QUESTIONS[Math.floor(Math.random() * PROG_QUESTIONS.length)];
    setCurrentQuestion(q);
    setTimeLeft(15);
  };

  useEffect(() => {
    if (matchState === 'battling' && timeLeft > 0 && !showExplanation) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (matchState === 'battling' && timeLeft === 0 && !showExplanation) {
      handleOpponentMove(true);
    }
  }, [timeLeft, matchState, showExplanation]);

  const handleOpponentMove = (playerTimedOut = false) => {
    const opponentCorrect = Math.random() < opponent.skill;
    if (opponentCorrect) {
      setOpponentScore(prev => prev + 1);
      setMatchLog(prev => [`${opponent.name} scored!`, ...prev].slice(0, 5));
    }
    
    setShowExplanation(true);
    setTimeout(() => {
        if (playerScore + opponentScore < 4) {
            nextRound();
        } else {
            setMatchState('results');
        }
    }, 3500);
  };

  const handleSelect = (opt) => {
    if (showExplanation) return;
    
    if (opt === currentQuestion.correct) {
      setPlayerScore(prev => prev + 1);
      sfx.correct();
      setMatchLog(prev => [`System breach! Score +1`, ...prev].slice(0, 5));
    } else {
      sfx.wrong();
      setMatchLog(prev => [`Injection failed!`, ...prev].slice(0, 5));
    }
    handleOpponentMove();
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-widest flex items-center">
            <Swords size={36} className="text-rose-500 mr-4" /> Nexus Arena
          </h1>
          <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-sm">Real-time Code Duel Protocol</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-400 font-mono text-xs animate-pulse">
           DAILY UPTIME: +60MIN EXTENSION ACTIVE
        </div>
      </header>

      <div className="relative min-h-[600px] flex items-center justify-center">
        
        {matchState === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-slate-900/40 p-12 rounded-[3rem] border-2 border-slate-800 backdrop-blur-xl max-w-lg">
             <div className="w-24 h-24 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                <Bug size={48} />
             </div>
             <h2 className="text-3xl font-black text-white mb-4">BUG HUNTER TRIALS</h2>
             <p className="text-slate-400 mb-8 font-mono text-sm leading-relaxed">
                Scan, identify, and resolve architectural flaws under extreme time pressure. 
                Winner receives massive XP buffers.
             </p>
             <button 
               onClick={startSearch}
               className="group relative bg-rose-600 hover:bg-rose-500 text-white font-black py-5 px-16 rounded-2xl uppercase tracking-widest transition-all overflow-hidden"
             >
               <span className="relative z-10">Locate Target</span>
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-300"></div>
             </button>
          </motion.div>
        )}

        {matchState === 'searching' && (
           <div className="flex flex-col items-center">
             <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 border-4 border-rose-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-rose-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Search size={48} className="text-rose-500 animate-pulse" />
                </div>
             </div>
             <h2 className="text-2xl font-black text-white tracking-widest uppercase animate-pulse">Scanning Grid...</h2>
          </div>
        )}

        {matchState === 'matched' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
             <div className="flex items-center space-x-12 bg-slate-900/90 p-12 rounded-[4rem] border-2 border-indigo-500">
                <div className="text-center">
                   <div className="w-24 h-24 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-5xl border-2 border-indigo-500 mb-4">{user.avatar}</div>
                   <div className="font-black text-white uppercase tracking-widest">{user.username}</div>
                </div>
                <div className="text-6xl font-black text-rose-600 italic animate-bounce">VS</div>
                <div className="text-center">
                   <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center text-5xl border-2 border-slate-700 mb-4">{opponent.avatar}</div>
                   <div className="font-black text-white uppercase tracking-widest">{opponent.name}</div>
                   <div className="text-xs text-rose-500 font-mono mt-1 font-black underline decoration-2">ELITE THREAT</div>
                </div>
             </div>
             <button onClick={startBattle} className="mt-12 bg-white text-slate-950 px-16 py-5 rounded-2xl font-black tracking-widest uppercase hover:scale-105 transition-all">Start Duel</button>
          </motion.div>
        )}

        {matchState === 'battling' && (
           <div className="w-full grid grid-cols-12 gap-8">
              {/* Leaderboard left */}
              <div className="col-span-3 space-y-4">
                 <div className="glass-panel p-6 rounded-3xl border-l-4 border-indigo-500">
                    <div className="text-xs font-black text-indigo-400 uppercase mb-2">You</div>
                    <div className="text-4xl font-mono font-black text-white">{playerScore}</div>
                 </div>
                 <div className="glass-panel p-6 rounded-3xl border-l-4 border-rose-500 text-right">
                    <div className="text-xs font-black text-rose-400 uppercase mb-2">{opponent.name}</div>
                    <div className="text-4xl font-mono font-black text-white">{opponentScore}</div>
                 </div>
                 
                 <div className="pt-8 opacity-40">
                    <div className="text-[10px] font-mono mb-2 uppercase text-slate-500">Terminal Log</div>
                    <div className="space-y-1">
                       {matchLog.map((log, i) => <div key={i} className="text-[10px] uppercase font-mono">{log}</div>)}
                    </div>
                 </div>
              </div>

              {/* Battle Zone center */}
              <div className="col-span-9">
                 <div className="glass-panel rounded-[2rem] border border-slate-700 overflow-hidden min-h-[500px] flex flex-col relative">
                    <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex justify-between items-center">
                       <div className="flex items-center space-x-2">
                          <Terminal size={16} className="text-indigo-400" />
                          <span className="text-xs font-mono font-black text-indigo-400 uppercase">{currentQuestion.lang} Protocol</span>
                       </div>
                       <div className={`font-mono font-black text-xl ${timeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>00:{timeLeft.toString().padStart(2, '0')}</div>
                    </div>

                    <div className="p-10 flex-1 flex flex-col justify-center">
                       {!showExplanation ? (
                          <>
                             <pre className="bg-slate-950 p-6 rounded-2xl border-2 border-indigo-500/20 text-indigo-300 font-mono text-sm leading-relaxed mb-10 overflow-x-auto">
                                <code>{currentQuestion.text}</code>
                             </pre>
                             <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options.map((opt, i) => (
                                   <button 
                                     key={i} 
                                     onClick={() => handleSelect(opt)}
                                     className="bg-slate-800/50 hover:bg-slate-700 border-2 border-slate-700 p-5 rounded-2xl font-bold text-white transition-all text-sm active:translate-y-1"
                                   >
                                      {opt}
                                   </button>
                                ))}
                             </div>
                          </>
                       ) : (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 bg-indigo-950/30 rounded-3xl border-2 border-indigo-500/40">
                             <div className="flex justify-center mb-6">
                                <CheckCircle2 size={64} className="text-emerald-500 animate-pulse" />
                             </div>
                             <h4 className="text-xl font-black text-white uppercase tracking-widest mb-4">Sector Analysis</h4>
                             <p className="text-slate-300 font-medium leading-relaxed mb-6">{currentQuestion.explanation}</p>
                             <div className="text-xs font-mono text-indigo-400 animate-pulse uppercase tracking-[0.3em]">Next Round Initializing...</div>
                          </motion.div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {matchState === 'results' && (
           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className={`w-32 h-32 rounded-full mx-auto mb-8 border-[10px] flex items-center justify-center text-5xl ${
                 playerScore > opponentScore ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-rose-500/20 border-rose-500 text-rose-500'
              }`}>
                 {playerScore > opponentScore ? '🏆' : '💀'}
              </div>
              <h2 className="text-6xl font-black text-white italic mb-10 tracking-tighter">
                 {playerScore > opponentScore ? 'SYSTEM BREACHED' : 'SYSTEM CRITICAL'}
              </h2>
              <div className="flex space-x-6 justify-center mb-12">
                 <div className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">+800 XP BUFFER</div>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">+200 CORE CREDITS</div>
                 </div>
              </div>
              <button 
                onClick={() => { sfx.click(); setMatchState('idle'); addXP(800); addCurrency(200); }} 
                className="bg-white text-slate-950 font-black px-16 py-5 rounded-2xl uppercase tracking-widest hover:scale-105 transition-all"
              >
                Return to Hanger
              </button>
           </motion.div>
        )}
      </div>
    </div>
  );
};

export default Arena;
