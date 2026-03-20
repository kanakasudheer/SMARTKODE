import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import missionsData from '../data/missions.json';
import { UserContext } from '../context/UserContext';
import { Play, Lock, CheckCircle, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/audioEngine';

const Missions = () => {
  const { user } = useContext(UserContext);
  
  // Create a visually connected node map
  // Missions are placed in a zig-zag pattern
  
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-widest flex items-center">
          <Play size={36} className="text-indigo-400 mr-4" /> Operations Map
        </h1>
        <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-sm">Select a sector to deploy into the arena</p>
      </div>

      <div className="relative p-10 mt-10">
        
        {/* Draw connecting lines behind nodes */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
           <svg className="w-full h-[80%] absolute top-0" preserveAspectRatio="none">
              <path 
                d="M 100,50 Q 300,50 300,200 T 500,200 T 600,400 T 800,400" 
                fill="transparent" 
                stroke="#1e293b" 
                strokeWidth="10" 
                strokeLinecap="round" 
                className="vector-path"
              />
           </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
          <AnimatePresence>
            {missionsData.map((mission, index) => {
              const isCompleted = user.completedMissions.includes(mission.id);
              // Logic: Unlocked if it's the first mission, OR the previous mission is completed.
              const isUnlocked = index === 0 || user.completedMissions.includes(missionsData[index - 1].id);
              const isBoss = mission.difficulty === 'Boss';

              let borderColor = 'border-slate-800';
              let glow = '';
              let bg = 'bg-slate-900/80';

              if (isCompleted) {
                borderColor = 'border-emerald-500/50 hover:border-emerald-400';
                glow = 'shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                bg = 'bg-emerald-950/20';
              } else if (isUnlocked) {
                borderColor = isBoss ? 'border-rose-500 hover:border-rose-400' : 'border-indigo-500 hover:border-indigo-400';
                glow = isBoss ? 'shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-pulse' : 'shadow-[0_0_30px_rgba(99,102,241,0.3)] animate-bounce-slow';
                bg = isBoss ? 'bg-rose-950/20' : 'bg-indigo-950/30';
              }

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => { if(isUnlocked) sfx.hover(); }}
                  className={`glass-panel p-6 rounded-[2rem] border-4 ${borderColor} ${glow} ${bg} relative flex flex-col justify-between backdrop-blur-md transition-colors duration-300 min-h-[220px] ${!isUnlocked && 'grayscale opacity-60'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                      isBoss ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 
                      mission.difficulty === 'Hard' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      mission.difficulty === 'Medium' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {mission.difficulty}
                    </span>
                    
                    {isCompleted && <CheckCircle className="text-emerald-400" />}
                    {!isUnlocked && <Lock className="text-slate-500" />}
                  </div>

                  <div>
                    <h3 className={`text-2xl font-black mb-1 uppercase tracking-wider ${isBoss ? 'text-rose-400' : 'text-white'}`}>
                      {mission.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-400 mb-6 font-mono tracking-widest">{mission.topic}</p>
                  </div>

                  {isUnlocked ? (
                    isCompleted ? (
                      <NavLink
                        to={`/quiz/${mission.id}`}
                        onClick={sfx.click}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl flex items-center justify-center transition-all uppercase tracking-widest text-xs border border-slate-700 border-b-4 active:border-b active:translate-y-1"
                      >
                        Replay Sector
                      </NavLink>
                    ) : (
                      <NavLink
                        to={`/quiz/${mission.id}`}
                        onClick={sfx.click}
                        className={`w-full text-white font-black py-4 rounded-xl flex items-center justify-center transition-all uppercase tracking-widest text-xs shadow-lg border-b-4 active:border-b active:translate-y-1 ${
                           isBoss ? 'bg-rose-600 hover:bg-rose-500 border-rose-800' : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-800'
                        }`}
                      >
                        {isBoss ? <div className="flex items-center"><Skull size={16} className="mr-2 animate-pulse" /> ENGAGE BOSS</div> : 'Deploy Now'}
                      </NavLink>
                    )
                  ) : (
                    <button disabled className="w-full bg-slate-900 border border-slate-800 text-slate-600 font-black py-4 rounded-xl flex items-center justify-center cursor-not-allowed uppercase tracking-widest text-xs">
                      Sector Locked
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Missions;
