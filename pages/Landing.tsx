import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Waves } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-cyber-900 relative overflow-hidden flex flex-col items-center justify-center selection:bg-cyan-500 selection:text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-cyber-900 to-black"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="z-10 text-center space-y-8 px-4">
        {/* Logo Mark */}
        <div className="inline-flex items-center justify-center p-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl mb-6 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
           <Activity className="w-16 h-16 text-cyan-400" />
        </div>

        {/* Typography */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
            ECO<span className="text-cyan-500">SENSE</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 font-light tracking-widest uppercase border-t border-b border-slate-800 py-4 max-w-2xl mx-auto">
            Environmental Acoustic Security Auditor
          </p>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <button 
            onClick={() => navigate('/login')}
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-none"
          >
            <div className="absolute inset-0 w-full h-full bg-cyan-600/20 group-hover:bg-cyan-600/30 transition-all duration-300 transform skew-x-12"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500"></div>
            <div className="absolute top-0 right-0 w-full h-[1px] bg-cyan-500"></div>
            
            <span className="relative flex items-center gap-3 text-cyan-400 font-mono text-lg font-bold tracking-widest group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
              INITIALIZE PROTOCOL
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 left-0 w-full text-center">
          <p className="text-[10px] text-slate-600 font-mono uppercase">
            Powered by Gemini 3.0 Multimodal Semantic Core
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;