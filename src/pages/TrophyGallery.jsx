import React, { useContext, useState } from 'react';
import { UserContext, BADGE_DEFS } from '../context/UserContext';
import { Trophy, ChevronLeft, ChevronRight, Sparkles, Orbit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/audioEngine';

const TrophyGallery = () => {
  const { user } = useContext(UserContext);
  const userBadges = user.badges.map(id => BADGE_DEFS[id]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    sfx.click();
    setCurrentIndex(prev => (prev + 1) % userBadges.length);
  };
  const prev = () => {
    sfx.click();
    setCurrentIndex(prev => (prev - 1 + userBadges.length) % userBadges.length);
  };

  if (userBadges.length === 0) {
    return (
       <div className="max-w-4xl mx-auto py-12 text-center bg-slate-900/50 p-20 rounded-[4rem] border-2 border-slate-800">
          <Trophy size={80} className="mx-auto text-slate-700 mb-8" />
          <h2 className="text-3xl font-black text-white uppercase mb-4 tracking-widest">Gallery Empty</h2>
          <p className="text-slate-400 font-mono text-sm max-w-sm mx-auto uppercase">Secure your first sector achievements to populate the trophy pedestals.</p>
       </div>
    );
  }

  const current = userBadges[currentIndex];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col items-center">
      <header className="mb-16 text-center">
         <h1 className="text-5xl font-black text-white uppercase tracking-tighter flex items-center justify-center">
            <Orbit size={48} className="text-indigo-500 mr-4 animate-spin-slow" /> Achievements Gallery
         </h1>
         <p className="text-slate-400 font-mono text-sm uppercase tracking-widest mt-2">{userBadges.length} Trophies Secure</p>
      </header>

      <div className="relative w-full max-w-2xl min-h-[500px] flex items-center justify-center">
         {/* Navigation Buttons */}
         <button onClick={prev} className="absolute left-0 z-50 p-6 bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700 hover:text-white transition-all active:scale-95 shadow-2xl">
            <ChevronLeft size={32} />
         </button>
         <button onClick={next} className="absolute right-0 z-50 p-6 bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700 hover:text-white transition-all active:scale-95 shadow-2xl">
            <ChevronRight size={32} />
         </button>

         {/* 3D Pedestal Stage */}
         <AnimatePresence mode="wait">
            <motion.div 
               key={current.id}
               initial={{ opacity: 0, scale: 0.5, rotateY: -110, y: 100 }}
               animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
               exit={{ opacity: 0, scale: 1.5, rotateY: 110, y: -100 }}
               transition={{ type: 'spring', damping: 15, stiffness: 100 }}
               className="relative flex flex-col items-center select-none"
               style={{ perspective: '1000px' }}
            >
               {/* Reflection/Shadow */}
               <div className="absolute -bottom-12 w-64 h-12 bg-white/20 blur-[60px] rounded-[100%] z-0" />
               
               {/* Trophy Icon */}
               <div className="relative z-10 text-[10rem] drop-shadow-[0_20px_50px_rgba(255,255,255,0.4)] hover:scale-110 transition-transform duration-500 cursor-pointer group">
                  {current.icon}
                  <Sparkles className="absolute -top-4 -right-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" size={48} />
               </div>

               {/* Pedestal Top */}
               <div className="w-80 h-12 bg-gradient-to-r from-slate-700 via-slate-400 to-slate-700 rounded-[100%] mt-8 border-b-8 border-slate-900 shadow-inner z-0" />
               
               {/* Pedestal Body */}
               <div className="w-64 h-24 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center border-x-8 border-slate-800 rounded-b-3xl">
                  <div className="font-black text-xl text-white uppercase tracking-[0.3em] overflow-hidden truncate px-4">{current.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest px-8 text-center">{current.desc}</div>
               </div>
            </motion.div>
         </AnimatePresence>
      </div>

      <div className="mt-12 flex space-x-2">
         {userBadges.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-indigo-500 w-12 shadow-[0_0_10px_indigo]' : 'bg-slate-800'}`} />
         ))}
      </div>
    </div>
  );
};

export default TrophyGallery;
