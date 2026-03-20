import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserProvider } from './context/UserContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Store from './pages/Store';
import Arena from './pages/Arena';
import Login from './pages/Login';
import Confetti from 'react-confetti';
import { AnimatePresence } from 'framer-motion';
import PrismaticBurst from './components/PrismaticBurst';
import TrophyToast from './components/TrophyToast';
import HackerTerminal from './components/HackerTerminal';
import HackerConsole from './components/HackerConsole';
import SkillTree from './pages/SkillTree';
import TrophyGallery from './pages/TrophyGallery';

function AppRoutes() {
  const { user, leveledUp } = useContext(UserContext);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + H (Original Terminal)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowTerminal(prev => !prev);
      }
      // Alt + T (Advanced Quantum Console)
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setShowConsole(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user.isLoggedIn) {
    return <Login />;
  }

  return (
    <div className={`flex h-screen bg-slate-950 text-slate-100 transition-colors duration-1000 overflow-hidden relative font-sans ${user.crtMode ? 'crt-mode' : ''} atmosphere-${user.atmosphere}`}>
      
      <TrophyToast />
      {showTerminal && <HackerTerminal onClose={() => setShowTerminal(false)} />}
      <AnimatePresence>
        {showConsole && <HackerConsole onClose={() => setShowConsole(false)} />}
      </AnimatePresence>

      {/* Prismatic Burst Background Layer for entire App */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-40">
        <PrismaticBurst
          animationType="rotate3d"
          intensity={2}
          speed={0.5}
          distort={0.5}
          paused={false}
          offset={{ x: 0, y: 0 }}
          hoverDampness={0.25}
          rayCount={0}
          mixBlendMode="lighten"
          colors={
            user.atmosphere === 'horizon' ? ['#f59e0b', '#fbbf24', '#0f172a'] :
            user.atmosphere === 'solar' ? ['#38bdf8', '#fbbf24', '#ffffff'] :
            user.atmosphere === 'sunset' ? ['#ec4899', '#8b5cf6', '#0f172a'] :
            ['#4f46e5', '#c026d3', '#0f172a']
          }
        />
      </div>

      {leveledUp && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} gravity={0.15} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-bounce shadow-2xl bg-indigo-600/90 text-white p-8 rounded-3xl border-4 border-yellow-400">
            <h1 className="text-6xl font-black mb-2 uppercase tracking-widest text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">LEVEL UP!</h1>
            <p className="text-2xl font-bold font-mono">You hit Level {user.level}!</p>
            <p className="text-sm font-mono text-yellow-200 mt-2 tracking-widest">+1 SKILL NODE MEMORY GRANTED</p>
          </div>
        </div>
      )}

      {/* Sidebar gets foreground z-index to stay above PrismaticBurst */}
      <div className="z-20 h-full"> 
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden z-10 relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/store" element={<Store />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/skills" element={<SkillTree />} />
            <Route path="/gallery" element={<TrophyGallery />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
