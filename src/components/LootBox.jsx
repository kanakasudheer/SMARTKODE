import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, X } from 'lucide-react';
import { sfx } from '../utils/audioEngine';

const LootBox = () => {
  const { addCurrency, user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [reward, setReward] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if claimed today
    const today = new Date().toDateString();
    if (user.lastLootDate !== today) {
      setTimeout(() => setVisible(true), 1500); // Wait for dashboard to load
    }
  }, [user.lastLootDate]);

  const handleOpen = () => {
    sfx.click();
    setIsOpen(true);
    
    // Pick random reward
    const rewards = [
      { type: 'currency', val: 50, label: '50 Credits' },
      { type: 'currency', val: 100, label: '100 Credits!' },
      { type: 'currency', val: 500, label: 'EPIC 500 CREDITS!!' },
    ];
    
    // Simulate spinning delay
    setTimeout(() => {
      const drop = rewards[Math.floor(Math.random() * rewards.length)];
      setReward(drop);
      addCurrency(drop.val);
      sfx.levelUp(); // Celebration
      
      // Save claim date
      setUser(prev => ({ ...prev, lastLootDate: new Date().toDateString() }));
    }, 1500);
  };

  const handleClose = () => {
    sfx.click();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="glass-panel w-full max-w-md bg-indigo-950/90 border-2 border-indigo-500 rounded-3xl p-8 relative shadow-[0_0_50px_rgba(99,102,241,0.5)] flex flex-col items-center text-center overflow-hidden"
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
        
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2 flex items-center">
           <Gift className="mr-2 text-indigo-400" /> DAILY SUPPLY DROP
        </h2>
        <p className="text-slate-300 text-sm mb-8 font-mono">Your daily login rations are ready.</p>

        {!isOpen ? (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="w-32 h-32 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse-fast border-2 border-indigo-300"
          >
            <Gift size={64} className="text-white drop-shadow-md" />
          </motion.div>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center relative">
            {!reward ? (
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-white rounded-full animate-spin" />
            ) : (
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1.2, rotate: 0 }}
                className="text-amber-400 text-5xl flex flex-col items-center"
              >
                <Zap size={64} className="drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] mb-2" />
              </motion.div>
            )}
          </div>
        )}

        <div className="h-16 mt-6 flex items-center justify-center">
           {reward && (
             <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
               <h3 className="text-2xl font-black text-amber-400 uppercase tracking-widest">{reward.label}</h3>
             </motion.div>
           )}
        </div>
      </motion.div>
    </div>
  );
};

export default LootBox;
