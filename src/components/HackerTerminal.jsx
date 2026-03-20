import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { Terminal } from 'lucide-react';
import { sfx } from '../utils/audioEngine';

const HackerTerminal = ({ onClose }) => {
  const { addXP, addCurrency, unlockBadge } = useContext(UserContext);
  const [logs, setLogs] = useState([
    'NEXUS_OS v9.42 INITIALIZING...',
    'CONNECTION ESTABLISHED TO MAINFRAME.',
    'WARNING: UNAUTHORIZED ACCESS DETECTED.',
    'Type "help" for a list of commands.'
  ]);
  const [input, setInput] = useState('');
  const endOfTerminal = useRef(null);

  useEffect(() => {
    endOfTerminal.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let response = '';

      setLogs(prev => [...prev, `> ${input}`]);
      sfx.click();

      switch (cmd) {
        case 'help':
          response = 'Available modules: status, hack, sudo, exit';
          break;
        case 'status':
          response = 'SYSTEM: COMPROMISED. SECURITY: CRITICAL.';
          break;
        case 'hack':
          response = 'Injecting payload... FAILED. Root access required.';
          break;
        case 'sudo mode':
        case 'sudo root':
        case 'root':
          response = 'ACCESS GRANTED. 50,000 CREDITS DEPOSITED. ADMIN BADGE UNLOCKED.';
          unlockBadge('boss_slayer'); // Using boss slayer as a placeholder for legend
          addCurrency(50000);
          addXP(10000);
          sfx.levelUp();
          break;
        case 'exit':
          onClose();
          return;
        default:
          response = `Command not recognized: ${cmd}`;
      }

      setTimeout(() => {
        setLogs(prev => [...prev, response]);
      }, 300);
      
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-black border border-emerald-500 rounded-lg overflow-hidden flex flex-col h-[60vh] shadow-[0_0_50px_rgba(16,185,129,0.3)]">
        
        {/* Terminal Header */}
        <div className="bg-emerald-950/40 border-b border-emerald-500/50 p-2 flex items-center justify-between text-emerald-500 font-mono text-xs uppercase tracking-widest">
           <div className="flex items-center"><Terminal size={14} className="mr-2" /> root@nexus-gate:~</div>
           <button onClick={() => { sfx.click(); onClose(); }} className="hover:text-emerald-300">Close [X]</button>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-emerald-400 text-sm flex flex-col space-y-2 crt-mode">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('WARNING') || log.includes('FAILED') ? 'text-rose-500' : ''}>
              {log}
            </div>
          ))}
          <div className="flex items-center space-x-2">
             <span>&gt;</span>
             <input 
               autoFocus
               type="text" 
               value={input} 
               onChange={(e) => setInput(e.target.value)} 
               onKeyDown={handleCommand}
               className="bg-transparent border-none outline-none flex-1 text-emerald-400 font-mono"
               spellCheck="false"
               autoComplete="off"
             />
          </div>
          <div ref={endOfTerminal} />
        </div>
      </div>
    </div>
  );
};

export default HackerTerminal;
