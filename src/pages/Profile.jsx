import React, { useContext, useState } from 'react';
import { UserContext, BADGE_DEFS } from '../context/UserContext';
import { Trophy, RefreshCcw, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { sfx } from '../utils/audioEngine';

const Profile = () => {
  const { user, setUser, logoutUser, toggleCRTMode } = useContext(UserContext);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const handleReset = () => {
    sfx.levelUp();
    setUser(prev => ({ 
      ...prev, xp: 0, level: 1, streak: 0, completedMissions: [], 
      weakTopics: [], currency: 0, badges: [], shopPurchases: [], activeColor: 'indigo'
    }));
    setShowWipeConfirm(false);
  };

  const nextLevelXP = user.level * 500;
  const progressPercent = Math.min((user.xp / nextLevelXP) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      <div className="flex justify-between items-end">
         <div>
           <h2 className="text-4xl font-black text-white flex items-center mb-2 drop-shadow-lg uppercase tracking-widest">
             <Trophy size={36} className="text-indigo-400 mr-4" /> Loadout
           </h2>
           <p className="text-slate-400 font-mono text-sm tracking-wider">Player Diagnostics & Trophy Case</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Memory Core */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90 absolute">
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={377} strokeDashoffset={377 - (377 * progressPercent) / 100}
                className="text-indigo-500 transition-all duration-1000 origin-center drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </svg>
            <div className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{user.avatar}</div>
          </div>
          
          <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-1">{user.username}</h3>
          <p className="text-indigo-400 font-mono font-bold tracking-wider mb-6">Level {user.level}</p>
          
          <div className="w-full grid grid-cols-2 gap-4">
             <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total XP</p>
                <p className="text-xl font-mono text-white font-black">{user.xp}</p>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Credits</p>
                <p className="text-xl font-mono text-emerald-400 font-black">{user.currency} CR</p>
             </div>
          </div>
        </div>

        {/* System Config */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest flex items-center">
            <Sparkles className="mr-3 text-purple-400" /> System Config
          </h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {!showWipeConfirm ? (
              <button
                onClick={() => { sfx.click(); setShowWipeConfirm(true); }}
                className="w-full py-4 px-6 rounded-2xl border-2 border-rose-500/30 text-rose-500 font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-between"
              >
                <span>Wipe Memory Card</span>
                <RefreshCcw size={20} />
              </button>
            ) : (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-rose-500/10 border-2 border-rose-500 rounded-2xl p-6 text-center">
                <p className="text-rose-400 font-bold mb-4 uppercase tracking-wider text-sm">Erase all progress & purchases?</p>
                <div className="flex space-x-3">
                  <button onClick={handleReset} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-black transition-colors uppercase">
                    Confirm
                  </button>
                  <button onClick={() => { sfx.click(); setShowWipeConfirm(false); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-black transition-colors uppercase">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <button
               onClick={toggleCRTMode}
               className={`w-full py-4 px-6 rounded-2xl border-2 font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                 user.crtMode ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-slate-700 text-slate-400 hover:bg-slate-800'
               }`}
            >
               <span>CRT OVERRIDE</span>
               <span className="text-xs">{user.crtMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
               onClick={logoutUser}
               className="w-full py-4 px-6 rounded-2xl border-2 border-slate-700 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all flex items-center justify-between"
            >
               <span>Disconnect Session</span>
               <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Trophy Case */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-xl">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest flex items-center">
          <Trophy className="mr-3 text-amber-400" /> Trophy Case
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.values(BADGE_DEFS).map((badge) => {
            const isUnlocked = user.badges?.includes(badge.id);
            return (
              <div 
                key={badge.id} 
                onMouseEnter={() => { if(isUnlocked) sfx.hover(); }}
                className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 group ${
                  isUnlocked 
                    ? 'border-amber-500/50 bg-amber-500/10 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:-translate-y-1' 
                    : 'border-slate-800 bg-slate-900/50 opacity-50 grayscale'
                }`}
              >
                {isUnlocked && <CheckCircle2 size={16} className="absolute top-2 right-2 text-amber-400" />}
                <div className={`text-4xl mb-3 ${!isUnlocked && 'opacity-20'}`}>
                   {badge.icon}
                </div>
                <h4 className="font-bold text-center text-sm uppercase tracking-wider mb-1 text-white">{badge.name}</h4>
                <p className="text-[10px] text-center text-slate-400 opacity-0 group-hover:opacity-100 absolute -bottom-10 bg-black/90 p-2 rounded-lg z-10 w-48 transition-opacity pointer-events-none border border-slate-700">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Profile;
