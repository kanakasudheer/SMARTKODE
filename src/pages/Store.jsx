import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ShoppingCart, Unlock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { sfx } from '../utils/audioEngine';

const STORE_ITEMS = [
  { id: 'emerald', name: 'Emerald Injector', desc: 'Unlock Emerald Green BorderGlows.', cost: 200, type: 'color', icon: '🟢' },
  { id: 'rose', name: 'Rose Overdrive', desc: 'Unlock Neon Rose BorderGlows.', cost: 200, type: 'color', icon: '🔴' },
  { id: 'amber', name: 'Amber Core', desc: 'Unlock Solid Amber BorderGlows.', cost: 200, type: 'color', icon: '🟠' },
  { id: 'avatar_dragon', name: 'Ancient Dragon', desc: 'Legendary Avatar Icon.', cost: 800, type: 'avatar', icon: '🐉' },
  { id: 'avatar_alien', name: 'Deep Space Alien', desc: 'Legendary Avatar Icon.', cost: 800, type: 'avatar', icon: '👽' },
];

const Store = () => {
  const { user, purchaseItem, equipColor, setUser } = useContext(UserContext);

  const handlePurchase = (item) => {
    if (item.type === 'avatar') {
       if (purchaseItem(item.id, item.cost, item.type)) {
         setUser(prev => ({ ...prev, avatar: item.icon }));
       }
    } else {
       purchaseItem(item.id, item.cost, item.type);
    }
  };

  const handleEquip = (item) => {
    if (item.type === 'color') equipColor(item.id);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 uppercase tracking-widest flex items-center">
             <ShoppingCart className="mr-3 text-emerald-400" size={40} /> THE BLACK MARKET
          </h1>
          <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-sm">Exchange Credits for Cosmetics & Overrides</p>
        </div>
        <div className="glass-panel px-6 py-4 rounded-2xl border border-emerald-500/30 flex flex-col items-center shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-emerald-950/20">
           <span className="text-xs font-black uppercase text-emerald-500 mb-1 tracking-widest">Available Balance</span>
           <span className="text-3xl font-mono text-emerald-400 font-bold">{user.currency} CR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORE_ITEMS.map((item, idx) => {
          const isOwned = user.shopPurchases.includes(item.id);
          const isEquipped = user.activeColor === item.id || user.avatar === item.icon;
          const canAfford = user.currency >= item.cost;

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onMouseEnter={sfx.hover}
              className={`glass-panel p-6 rounded-3xl border-2 flex flex-col relative overflow-hidden transition-all duration-300 ${isOwned ? 'border-indigo-500/50 hover:border-indigo-400' : 'border-slate-800 hover:border-slate-600'}`}
            >
               {isOwned && <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">OWNED</div>}
               
               <div className="text-6xl mb-4 drop-shadow-xl flex justify-center">{item.icon}</div>
               <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 text-center">{item.name}</h3>
               <p className="text-slate-400 text-sm font-medium mb-6 text-center h-10">{item.desc}</p>
               
               <div className="mt-auto">
                 {isOwned ? (
                   <button 
                     onClick={() => handleEquip(item)}
                     disabled={isEquipped}
                     className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                       isEquipped 
                         ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 cursor-default' 
                         : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                     }`}
                   >
                     {isEquipped ? <span className="flex items-center justify-center"><CheckCircle size={16} className="mr-2" /> EQUIPPED</span> : 'EQUIP ITEM'}
                   </button>
                 ) : (
                   <button 
                     onClick={() => handlePurchase(item)}
                     disabled={!canAfford}
                     className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center ${
                       canAfford 
                         ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                         : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed'
                     }`}
                   >
                     <Unlock size={16} className="mr-2" /> {item.cost} CR
                   </button>
                 )}
               </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Store;
