import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { sfx } from '../utils/audioEngine';

const TrophyToast = () => {
  const { newBadge } = useContext(UserContext);

  return (
    <AnimatePresence>
      {newBadge && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] glass-panel bg-amber-950/90 border border-amber-500 p-4 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center space-x-4 w-[350px]"
          onClick={sfx.click}
        >
           <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-2xl shadow-inner border-[3px] border-yellow-200">
             {newBadge.icon}
           </div>
           <div>
             <div className="text-amber-500 text-xs font-black uppercase tracking-widest mb-1 flex items-center">
               <Trophy size={12} className="mr-1" /> TROPHY UNLOCKED
             </div>
             <h3 className="text-white font-bold text-lg leading-tight">{newBadge.name}</h3>
             <p className="text-amber-200/70 text-xs mt-1 leading-snug">{newBadge.desc}</p>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrophyToast;
