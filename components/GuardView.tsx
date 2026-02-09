import React from 'react';
import { ShieldCheck, ShieldAlert, Bell, EyeOff, ArrowRight } from 'lucide-react';
import { AudioEvent } from '../types';

interface GuardViewProps {
  status: 'safe' | 'warning' | 'danger';
  narrative: string;
  recentEvents: AudioEvent[];
  onViewEvidence: () => void;
}

const GuardView: React.FC<GuardViewProps> = ({ status, narrative, recentEvents, onViewEvidence }) => {
  const isDanger = status === 'danger';
  const isWarning = status === 'warning';
  
  const statusColor = isDanger ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-emerald-500';
  const shieldGlow = isDanger ? 'drop-shadow-[0_0_50px_rgba(239,68,68,0.5)]' : isWarning ? 'drop-shadow-[0_0_50px_rgba(234,179,8,0.3)]' : 'drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]';

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto space-y-12 animate-in fade-in zoom-in duration-500">
      
      {/* Central Shield */}
      <div className="text-center space-y-6">
        <div className={`transition-all duration-1000 transform ${isDanger ? 'scale-110' : 'scale-100'}`}>
          {isDanger ? (
            <ShieldAlert className={`w-48 h-48 mx-auto ${statusColor} ${shieldGlow} animate-pulse`} strokeWidth={1} />
          ) : (
            <ShieldCheck className={`w-48 h-48 mx-auto ${statusColor} ${shieldGlow}`} strokeWidth={1} />
          )}
        </div>
        
        <div>
          <h2 className={`text-4xl font-black tracking-tight ${statusColor} uppercase`}>
            {isDanger ? 'Anomaly Detected' : isWarning ? 'Suspicious Activity' : 'System Monitoring'}
          </h2>
          <p className="text-slate-400 mt-2 text-lg max-w-lg mx-auto leading-relaxed">
            {isDanger || isWarning ? narrative : "Environment is stable. Acoustic sensors active."}
          </p>
        </div>
      </div>

      {/* Narrative Feed (Short) */}
      {(isDanger || isWarning) && recentEvents.length > 0 && (
        <div className="w-full bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 space-y-2 backdrop-blur-sm">
          {recentEvents.slice(-3).map((evt, i) => (
             <div key={i} className="flex items-center gap-3 text-sm text-slate-300 font-mono">
               <span className="text-cyan-500 opacity-70">{evt.timestamp}</span>
               <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
               <span>{evt.description}</span>
             </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col w-full gap-4">
        {isDanger || isWarning ? (
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Bell className="w-5 h-5" />
              NOTIFY OWNER
            </button>
            <button className="flex items-center justify-center gap-3 py-4 bg-slate-800 text-slate-400 rounded-lg font-bold text-lg hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
              <EyeOff className="w-5 h-5" />
              IGNORE
            </button>
          </div>
        ) : (
           <div className="text-center text-slate-600 font-mono text-sm uppercase tracking-widest">
             // No Actions Required
           </div>
        )}

        {/* Forensic Entry */}
        <button 
          onClick={onViewEvidence}
          className="mx-auto flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm tracking-wider mt-4 group"
        >
          VIEW EVIDENCE PACK
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default GuardView;