import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Cpu, ShieldAlert, Wifi, Globe, Send, X, AlertTriangle } from 'lucide-react';
import { sfx } from '../utils/audioEngine';
import { UserContext } from '../context/UserContext';

const HackerConsole = ({ onClose }) => {
  const { user, purchaseItem } = React.useContext(UserContext);
  const [input, setInput] = useState('');
  const [showMarket, setShowMarket] = useState(false);
  const [history, setHistory] = useState([
    { type: 'system', text: 'NEXUS OS v3.1.0 - KERNEL: QUANTUM-7' },
    { type: 'system', text: 'UPTIME: 184:22:11 - ENCRYPTION: AES-4096' },
    { type: 'system', text: 'READY FOR COMMANDS...' },
  ]);
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const scrollRef = useRef(null);

  const DARK_ITEMS = [
    { id: 'glitch_1', name: 'Corrupt Core', icon: '🌀', cost: 1337 },
    { id: 'glitch_2', name: 'Void Walker', icon: '🕳️', cost: 2500 }
  ];

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showMarket]);

  const addLog = (text, type = 'info') => {
    setHistory(prev => [...prev, { type, text }]);
  };

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.toLowerCase().trim();
    addLog(`> ${input}`, 'user');
    setInput('');
    sfx.click();

    switch (cmd) {
      case 'help':
        addLog('AVAILABLE PROTOCOLS:', 'system');
        addLog(' - scan: Inspect local sector vulnerabilities');
        addLog(' - breach [host]: Attempt forced entry');
        addLog(' - market: Access deep-web data relay');
        addLog(' - clear: Erase local buffer');
        addLog(' - system: Core hardware diagnostics');
        addLog(' - shutdown: Exit terminal');
        break;
      case 'scan':
        addLog('INITIATING WIDE-BAND RADAR SCAN...', 'info');
        setTimeout(() => addLog('FOUND: localhost:8080 (VULNERABLE)', 'warn'), 800);
        setTimeout(() => addLog('FOUND: remote-relay-04 (HIGH ENCRYPTION)', 'info'), 1500);
        break;
      case 'market':
        if (user.skills.includes('dark_web')) {
           addLog('ESTABLISHING SECURE P2P CONNECTION...', 'info');
           setTimeout(() => setShowMarket(true), 1000);
        } else {
           addLog('CRITICAL ERROR: Protocol "market" requires DARK_WEB_ACCESS skill node.', 'error');
           addLog('ACCESS DENIED.', 'error');
        }
        break;
      case 'breach localhost':
        setIsHacking(true);
        setHackProgress(0);
        addLog('COMMENCING BRUTE-FORCE INJECTION...', 'warn');
        break;
      case 'system':
        addLog('CPU: 16-CORE QUANTUM PROCESSOR', 'info');
        addLog('RAM: 128EB PHASE-CHANGE MEMORY', 'info');
        addLog('FIREWALL: BYPASSED', 'warn');
        break;
      case 'clear':
        setHistory([]);
        setShowMarket(false);
        break;
      case 'shutdown':
        onClose();
        break;
      default:
        addLog(`ERROR: '${cmd.split(' ')[0]}' is not a recognized protocol.`, 'error');
    }
  };

  const buyDark = (item) => {
     if (purchaseItem(item.id, item.cost, 'avatar')) {
        addLog(`PURCHASE SUCCESSFUL: ${item.name} SYNCED.`, 'system');
     } else {
        addLog(`PURCHASE FAILED: INSUFFICIENT CORE CREDITS.`, 'error');
     }
  };

  useEffect(() => {
    if (isHacking) {
      const interval = setInterval(() => {
        setHackProgress(p => {
            if (p >= 100) {
              clearInterval(interval);
              setIsHacking(false);
              addLog('ACCESS GRANTED. DATA STREAM OPENED.', 'system');
              sfx.levelUp();
              return 100;
            }
            if (Math.random() > 0.7) {
                addLog(`INJECTING PACKET: 0x${Math.floor(Math.random()*0xFFFF).toString(16).toUpperCase()}`, 'info');
            }
            return p + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isHacking]);

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: -20, opacity: 0 }}
      className="fixed inset-x-0 bottom-0 top-1/2 z-[100] bg-slate-950/90 backdrop-blur-2xl border-t-2 border-emerald-500/50 flex flex-col font-mono text-emerald-500 shadow-[0_-20px_50px_rgba(0,0,1,0.8)]"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20">
        <div className="flex items-center space-x-3">
          <TerminalIcon size={14} className="animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Quantum Terminal Layer 1</span>
        </div>
        <div className="flex items-center space-x-6">
           <div className="flex space-x-4">
              <div className="flex items-center space-x-1"><Globe size={12} /> <span className="text-[10px]">CONNECTED</span></div>
              <div className="flex items-center space-x-1 text-rose-400"><ShieldAlert size={12} /> <span className="text-[10px]">THREAT DETECTED</span></div>
           </div>
           <button onClick={onClose} className="hover:text-white transition-colors"><X size={18} /></button>
        </div>
      </div>

      {/* Output Buffer */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-1 custom-scrollbar text-sm"
      >
        {history.map((log, i) => (
          <div key={i} className={`flex space-x-2 ${
            log.type === 'error' ? 'text-rose-400' : 
            log.type === 'warn' ? 'text-amber-400' : 
            log.type === 'system' ? 'text-cyan-400' : 
            log.type === 'user' ? 'text-white' : ''
          }`}>
            <span className="opacity-40">{new Date().toLocaleTimeString().split(' ')[0]}</span>
            <span className="font-bold">{log.text}</span>
          </div>
        ))}

        {showMarket && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-8 grid grid-cols-2 gap-4">
             {DARK_ITEMS.map(item => (
                <div key={item.id} className="bg-emerald-500/5 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between group hover:bg-emerald-500/10 transition-all">
                   <div className="flex items-center space-x-4">
                      <div className="text-3xl grayscale active:grayscale-0 group-hover:grayscale-0 duration-500">{item.icon}</div>
                      <div>
                         <div className="text-xs font-black uppercase tracking-widest">{item.name}</div>
                         <div className="text-[10px] text-emerald-500/70 font-mono">{item.cost} CR</div>
                      </div>
                   </div>
                   <button 
                     onClick={() => buyDark(item)}
                     disabled={user.shopPurchases.includes(item.id)}
                     className="px-4 py-2 border border-emerald-500/50 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-slate-950 transition-all disabled:opacity-30"
                   >
                     {user.shopPurchases.includes(item.id) ? 'OWNED' : 'DOWNLOAD'}
                   </button>
                </div>
             ))}
          </motion.div>
        )}

        {isHacking && (
          <div className="pt-4">
             <div className="flex justify-between text-[10px] mb-1">
                <span>INTRUSION LOAD:</span>
                <span>{hackProgress}%</span>
             </div>
             <div className="w-full bg-slate-900 h-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${hackProgress}%` }} 
                  className="bg-emerald-500 h-full shadow-[0_0_10px_#10b981]"
                />
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-emerald-500/5 border-t border-emerald-500/10">
        <form onSubmit={handleCommand} className="flex items-center space-x-3">
          <span className="text-emerald-500/50">root@nexus:~$</span>
          <input 
            autoFocus
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' for protocols..."
            className="flex-1 bg-transparent border-none outline-none text-emerald-400 font-mono"
            disabled={isHacking}
          />
          <Send size={18} className="text-emerald-900" />
        </form>
      </div>
    </motion.div>
  );
};

export default HackerConsole;
