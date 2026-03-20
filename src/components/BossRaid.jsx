import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { ShieldAlert, Zap, Timer, Swords, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/audioEngine';

const BossRaid = () => {
  const { user, damageBoss, addXP, addCurrency } = useContext(UserContext);
  const [isHitting, setIsHitting] = useState(false);
  const maxHealth = 100000;
  const percentage = (user.bossHealth / maxHealth) * 100;

  const handleStrike = () => {
    setIsHitting(true);
    sfx.click();
    
    // Crit check
    let dmg = 15;
    if (user.skills.includes('crit_chance') && Math.random() < 0.1) {
        dmg = 50;
        sfx.levelUp();
    }
    
    damageBoss(dmg);
    addXP(1); // Small reward for each strike
    addCurrency(0.5); // Micro currency gain

    setTimeout(() => setIsHitting(false), 100);
  };

  return (
    <div className="w-full glass-panel p-6 rounded-[2rem] border border-rose-500/30 overflow-hidden relative mb-12">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-rose-500/5 z-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 relative">
           <div className={`w-24 h-24 bg-rose-500/20 text-rose-500 rounded-[2.5rem] flex items-center justify-center border-4 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.3)] ${isHitting ? 'scale-90 animate-pulse bg-rose-500/40' : 'animate-bounce'}`}>
              <Skull size={48} />
           </div>
           {isHitting && (
              <motion.div initial={{ opacity: 1, scale: 0.5, y: 0 }} animate={{ opacity: 0, scale: 2, y: -50 }} className="absolute inset-0 flex items-center justify-center text-rose-500 font-bold pointer-events-none">
                 -15 HP
              </motion.div>
           )}
        </div>

        <div className="flex-1">
           <div className="flex justify-between items-end mb-3">
              <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center">
                    <ShieldAlert size={20} className="text-rose-500 mr-2" /> Global Raid Boss: THE VOID OVERLORD
                 </h2>
                 <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-1">Community event: Every strike deals damage</p>
              </div>
              <div className="text-right">
                 <span className="text-xs font-black text-rose-400 font-mono tracking-tighter uppercase">{user.bossHealth} / {maxHealth} HP</span>
              </div>
           </div>
           
           {/* Boss Health Bar */}
           <div className="h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${percentage}%` }} 
                className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-all ease-out"
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-[0.4em] drop-shadow-md">
                 Intrusion in Progress
              </div>
           </div>

           <div className="flex justify-between mt-4">
              <div className="flex space-x-4 text-[10px] text-slate-500 font-mono uppercase font-black">
                 <span className="flex items-center"><Zap size={12} className="mr-1" /> Multiplier x1.0</span>
                 <span className="flex items-center text-emerald-400 underline underline-offset-4"><Timer size={12} className="mr-1" /> EVENT ENDS IN 12:44:03</span>
              </div>
              <button 
                onClick={handleStrike}
                className="group relative bg-rose-600 hover:bg-rose-500 text-white font-black py-2 px-8 rounded-xl uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-rose-950/20 active:scale-95 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center"><Swords size={12} className="mr-2" /> Strike Core</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BossRaid;
