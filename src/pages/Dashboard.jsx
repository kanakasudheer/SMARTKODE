import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ProgressBar from '../components/ProgressBar';
import { Flame, Star, Trophy, Shield } from 'lucide-react';
import LootBox from '../components/LootBox';
import BossRaid from '../components/BossRaid';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const nextLevelXp = user.level * 500;

  // Mock activity data based on level for the chart
  const activityData = Array.from({ length: 7 }).map((_, i) => ({
    name: `Day ${i + 1}`,
    xp: Math.floor(Math.random() * 200) + (i * 20) + (user.xp * 0.1)
  }));

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

      <LootBox />
      <BossRaid />

      <header className="mb-8">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 uppercase tracking-tighter">
          SMARTKODE DASHBOARD
        </h2>
        <p className="text-slate-400 font-mono text-sm tracking-widest mt-2 uppercase">Welcome back, {user.username}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP Card */}
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 shadow-[0_4px_30px_rgba(99,102,241,0.1)] hover:shadow-[0_4px_40px_rgba(99,102,241,0.3)] transition-all flex flex-col justify-between group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all">
              <Star size={24} className="fill-current" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Current Level</p>
              <h3 className="text-3xl font-black text-white">{user.level}</h3>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 font-mono">
              <span>{user.xp} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <ProgressBar current={user.xp} max={nextLevelXp} color="bg-indigo-500" />
            <p className="text-xs text-indigo-400 mt-3 font-bold">{nextLevelXp - user.xp} XP to level up</p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-panel p-6 rounded-3xl border border-orange-500/30 shadow-[0_4px_30px_rgba(249,115,22,0.1)] hover:shadow-[0_4px_40px_rgba(249,115,22,0.3)] transition-all flex flex-col justify-between group">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/30 transition-all">
              <Flame size={24} className="fill-current" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Activity Streak</p>
              <h3 className="text-3xl font-black text-white">{user.streak} Days</h3>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-orange-400 font-bold">Keep it up to earn XP multipliers!</p>
          </div>
        </div>

        {/* Completed Missions Card */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 shadow-[0_4px_30px_rgba(16,185,129,0.1)] hover:shadow-[0_4px_40px_rgba(16,185,129,0.3)] transition-all flex flex-col justify-between group">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
              <Trophy size={24} className="fill-current" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Missions Cleared</p>
              <h3 className="text-3xl font-black text-white">{user.completedMissions.length}</h3>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-emerald-400 font-bold">Unlocking new sectors...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">XP Telemetry</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Needs Focus Section */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col">
          <h3 className="text-lg font-black text-rose-400 mb-6 uppercase tracking-widest">Target Priorities</h3>
          {user.weakTopics.length > 0 ? (
            <ul className="space-y-3 flex-1 overflow-y-auto">
              {user.weakTopics.map((topic, i) => (
                <li key={i} className="flex items-center bg-rose-950/20 p-4 rounded-xl border border-rose-500/20 hover:border-rose-500/50 transition-colors cursor-default">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-3"></div>
                  <span className="font-mono text-sm font-bold text-slate-200">{topic}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <Shield size={48} className="text-emerald-500/50 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">All systems optimal.</p>
              <p className="text-xs text-emerald-500 mt-2 font-mono">No vulnerabilities detected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
