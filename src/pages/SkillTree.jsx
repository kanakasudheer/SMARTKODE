import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { GitBranch, Zap, ShoppingCart, Crosshair, Sparkles, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { sfx } from '../utils/audioEngine';

const SKILLS = [
  { 
    id: 'xp_buff', 
    name: 'The Architect', 
    desc: 'XP gain increased by 25% from all activities.', 
    icon: <Brain />, 
    cost: 1, 
    color: 'indigo' 
  },
  { 
    id: 'credit_buff', 
    name: 'Merchant Lord', 
    desc: 'Gain 50% more Credits (CR) from mission completion.', 
    icon: <ShoppingCart />, 
    cost: 2, 
    color: 'emerald' 
  },
  { 
    id: 'crit_chance', 
    name: 'Precision Strike', 
    desc: 'Small chance to deal double damage to the Raid Boss.', 
    icon: <Crosshair />, 
    cost: 1, 
    color: 'rose' 
  },
  { 
    id: 'dark_web', 
    name: 'Dark Web Access', 
    desc: 'Unlocks the secret marketplace in the Quantum Console.', 
    icon: <Zap />, 
    cost: 3, 
    color: 'purple' 
  }
];

const SkillTree = () => {
  const { user, unlockSkill } = useContext(UserContext);

  const handleUnlock = (s) => {
    if (user.skills.includes(s.id)) return;
    if (unlockSkill(s.id, s.cost)) {
      sfx.unlock();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-widest flex items-center">
          <GitBranch size={36} className="text-indigo-500 mr-4" /> Neural Skill Tree
        </h1>
        <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-sm">
          Allocate points to augment your digital signature.
        </p>
      </header>

      <div className="bg-indigo-950/20 border-2 border-indigo-500/20 p-8 rounded-[3rem] mb-12 flex items-center justify-between">
         <div>
            <div className="text-xs font-black text-indigo-400 uppercase mb-1">Available Memory Nodes</div>
            <div className="text-5xl font-black text-white">{user.skillPoints} SP</div>
         </div>
         <div className="text-right">
            <p className="text-slate-400 text-sm max-w-xs italic">
               Earn 1 Skill Point (SP) every time you reach a new level.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILLS.map((skill) => {
          const isUnlocked = user.skills.includes(skill.id);
          const canAfford = user.skillPoints >= skill.cost;

          return (
            <motion.div 
              key={skill.id}
              whileHover={{ scale: 1.02 }}
              className={`glass-panel p-6 rounded-3xl border-2 transition-all relative overflow-hidden ${
                isUnlocked ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                 <div className={`p-4 rounded-2xl ${isUnlocked ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {React.cloneElement(skill.icon, { size: 24 })}
                 </div>
                 <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      isUnlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                       {isUnlocked ? 'Protocol Active' : `${skill.cost} SP REQUIRED`}
                    </span>
                 </div>
              </div>

              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{skill.name}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{skill.desc}</p>

              <button 
                onClick={() => handleUnlock(skill)}
                disabled={isUnlocked || !canAfford}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                  isUnlocked 
                    ? 'bg-emerald-500/20 text-emerald-400 cursor-default' 
                    : canAfford 
                      ? 'bg-white text-slate-900 hover:bg-indigo-100' 
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                {isUnlocked ? 'UNLOCKED' : canAfford ? 'ACTIVATE NODE' : 'INSUFFICIENT MEMORY'}
              </button>

              {isUnlocked && (
                <div className="absolute top-0 right-0 p-2">
                   <Sparkles className="text-indigo-400 animate-pulse" size={16} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillTree;
