import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_USER } from '../constants';
import { ShieldCheck, Cpu } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // Auto-fill credentials for implicit demo mode (Judges convenience)
  const [username, setUsername] = useState(MOCK_USER.username);
  const [password, setPassword] = useState(MOCK_USER.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay for backend validation
    setTimeout(() => {
      if (username === MOCK_USER.username && password === MOCK_USER.password) {
        const user: User = {
          username,
          role: 'admin',
          token: 'mock-jwt-token-xyz'
        };
        onLogin(user);
        navigate('/audit');
      } else {
        setError('Invalid credentials. Access Denied.');
        setLoading(false);
      }
    }, 800); // Slightly faster for demo
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-center">
      <div className="absolute inset-0 bg-cyber-900/90 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-cyber-800/80 border border-cyber-700 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-cyber-900 rounded-full border border-cyan-500/30 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Cpu className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EcoSense</h1>
          <p className="text-cyan-500/80 font-mono text-sm mt-2">ENVIRONMENTAL SEMANTIC AGENT</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Agent ID</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-cyber-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-600 transition-all outline-none"
              placeholder="Enter ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Passkey</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cyber-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-600 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2
              ${loading 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating...
              </span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Initialize System
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-slate-500 font-mono">
          SECURE CONNECTION :: V3.2.1-BETA
        </div>
      </div>
    </div>
  );
};

export default Login;