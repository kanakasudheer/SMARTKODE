import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Target, Trophy, Activity, LayoutDashboard, Settings, LogOut, ShoppingCart, Swords, GitBranch, Orbit } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { sfx } from '../utils/audioEngine';

const Sidebar = () => {
  const { user, logoutUser } = useContext(UserContext);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Battle Arena', icon: <Swords size={20} />, path: '/arena' },
    { name: 'Neural Skills', icon: <GitBranch size={20} />, path: '/skills' },
    { name: 'Trophy Room', icon: <Orbit size={20} />, path: '/gallery' },
    { name: 'Operations', icon: <Target size={20} />, path: '/missions' },
    { name: 'Rankings', icon: <Trophy size={20} />, path: '/leaderboard' },
    { name: 'Black Market', icon: <ShoppingCart size={20} />, path: '/store' },
    { name: 'Loadout', icon: <Settings size={20} />, path: '/profile' },
  ];

  return (
    <div className="w-64 border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl flex flex-col h-full shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex justify-center uppercase items-center font-mono">
          <Activity className="mr-2 text-indigo-500" /> SMARTKODE
        </h1>
      </div>

      <div className="flex-1 p-4 flex flex-col space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onMouseEnter={sfx.hover}
            onClick={sfx.click}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-sm ${isActive
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-[1.02]'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:scale-[1.02] border border-transparent'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-3 mb-4 p-2 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl shadow-inner border border-indigo-500/30">
            {user.avatar}
          </div>
          <div>
            <p className="text-sm font-black text-slate-200 uppercase tracking-widest truncate max-w-[120px]">{user.username}</p>
            <div className="flex space-x-2 text-xs font-mono font-bold">
              <span className="text-amber-400">XP {user.xp}</span>
              <span className="text-emerald-400">CR {user.currency}</span>
            </div>
          </div>
        </div>
        <button onClick={logoutUser} className="w-full flex items-center justify-center space-x-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 px-4 py-3 rounded-xl transition-all font-bold uppercase tracking-widest text-xs border border-rose-500/20 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]">
          <LogOut size={16} /> <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
