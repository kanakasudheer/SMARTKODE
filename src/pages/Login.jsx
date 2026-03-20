import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import LoginPageComponents from '../components/ui/gaming-login';

const Login = () => {
  const { loginUser } = useContext(UserContext);

  const handleLogin = (email, password, remember) => {
    console.log('Login attempt:', { email, password, remember });
    // Parse email for username or use default
    const username = email.split('@')[0] || 'PlayerOne';

    // Assorted avatars
    const avatars = ['⚔️', '🛡️', '🧙‍♂️', '🥷', '🤖', '👾'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    loginUser(username, randomAvatar);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 bg-slate-950">

      {/* NexusGate Video Background Layer */}
      <LoginPageComponents.VideoBackground videoUrl="https://videos.pexels.com/video-files/8128311/8128311-uhd_2560_1440_25fps.mp4" />

      {/* Login Form Box */}
      <div className="relative z-20 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <LoginPageComponents.LoginForm onSubmit={handleLogin} />
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-xs tracking-widest uppercase font-mono z-20">
        © 2026 SmartKode Operations. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
