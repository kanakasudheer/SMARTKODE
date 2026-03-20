import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Trophy, Crown, ArrowUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock user pool for the simulated leaderboard
const MOBS = [
  { id: 'b1', username: 'CyberShark', xp: 4200, avatar: '🦈', rank: 1 },
  { id: 'b2', username: 'ByteNinja', xp: 3800, avatar: '🥷', rank: 2 },
  { id: 'b3', username: 'NeonKnight', xp: 3100, avatar: '🛡️', rank: 3 },
  { id: 'b4', username: 'GhostCoder', xp: 2500, avatar: '👻', rank: 4 },
  { id: 'b5', username: 'FrontendMage', xp: 1200, avatar: '⭐', rank: 5 },
  { id: 'b6', username: 'CrashTest', xp: 300, avatar: '💀', rank: 6 },
];

const Leaderboard = () => {
  const { user } = useContext(UserContext);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Inject the real user into the mock pool
    const combined = [
      ...MOBS,
      { id: 'player_1', username: user.username, xp: user.xp, avatar: user.avatar, isPlayer: true }
    ];

    // Sort by XP
    combined.sort((a, b) => b.xp - a.xp);
    
    // Assign Ranks
    combined.forEach((entry, idx) => { entry.rank = idx + 1; });
    
    setLeaderboard(combined);

    // Simulate bots gaining XP slowly over time while on the page
    const simInterval = setInterval(() => {
      setLeaderboard(prev => {
        let updated = prev.map(p => {
          if (!p.isPlayer && Math.random() > 0.7) { 
            // 30% chance every 4 seconds for a bot to artificially gain XP
            return { ...p, xp: p.xp + Math.floor(Math.random() * 50) + 10 };
          }
           // Ensure the player object updates with context if they run loops
          if (p.isPlayer) {
            return { ...p, xp: user.xp };
          }
          return p;
        });

        // Resort inside interval
        updated.sort((a, b) => b.xp - a.xp);
        updated.forEach((entry, idx) => { entry.rank = idx + 1; });
        return updated;
      });
    }, 4000);

    return () => clearInterval(simInterval);
  }, [user.xp, user.username, user.avatar]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mr-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          <Trophy size={32} className="text-white drop-shadow-lg" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 uppercase tracking-widest">Global Rankings</h1>
          <p className="text-amber-200/50 font-mono text-sm tracking-widest mt-1">Live Arena Data Stream</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-900/80 border-b border-slate-800 text-xs font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-7">Operative</div>
          <div className="col-span-3 text-right">Total XP</div>
        </div>

        <div className="p-2 relative">
          <AnimatePresence>
            {leaderboard.map((player) => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`grid grid-cols-12 gap-4 px-6 py-5 items-center rounded-2xl mb-2 last:mb-0 border-2 transition-colors duration-300
                  ${player.isPlayer 
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                    : player.rank === 1 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/50 border-transparent hover:bg-slate-800'}
                `}
              >
                {/* RANK */}
                <div className="col-span-2 flex justify-center items-center">
                  {player.rank === 1 ? (
                    <Crown size={28} className="text-amber-400 animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                  ) : player.rank === 2 ? (
                    <span className="text-2xl font-black text-slate-300">#2</span>
                  ) : player.rank === 3 ? (
                    <span className="text-2xl font-black text-amber-700">#3</span>
                  ) : (
                    <span className="text-xl font-bold text-slate-600">#{player.rank}</span>
                  )}
                </div>

                {/* USER */}
                <div className="col-span-7 flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                    player.isPlayer ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-800 border-slate-700'
                  }`}>
                    {player.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-black uppercase tracking-wider text-sm ${player.isPlayer ? 'text-indigo-300' : 'text-slate-200'}`}>
                      {player.username}
                    </span>
                    {player.isPlayer && <span className="text-[10px] text-indigo-400 font-bold tracking-widest">(YOU)</span>}
                  </div>
                </div>

                {/* XP */}
                <div className="col-span-3 flex justify-end items-center">
                   <div className="flex flex-col items-end">
                      <span className={`font-mono font-black text-xl ${player.isPlayer ? 'text-white' : 'text-slate-300'}`}>
                        {player.xp.toLocaleString()}
                      </span>
                      {player.isPlayer && (
                        <span className="text-xs text-emerald-400 flex items-center font-bold tracking-widest">
                          <ArrowUp size={12} className="mr-1" /> ACTIVE
                        </span>
                      )}
                      {!player.isPlayer && player.rank === 1 && (
                        <span className="text-[10px] text-amber-500 flex items-center font-bold tracking-widest mt-1">
                          <Zap size={10} className="mr-1" /> DOMINATING
                        </span>
                      )}
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
