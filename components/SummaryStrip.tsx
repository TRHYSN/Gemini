import React from 'react';
import { Activity, Clock, Layers, ShieldCheck, ShieldAlert } from 'lucide-react';

interface SummaryStripProps {
  status: 'safe' | 'warning' | 'danger';
  confidence: number;
  latency: number;
  evidenceCount: number;
  mode: 'GUARD' | 'FORENSIC';
  onToggleMode: (mode: 'GUARD' | 'FORENSIC') => void;
}

const SummaryStrip: React.FC<SummaryStripProps> = ({ 
  status, 
  confidence, 
  latency, 
  evidenceCount, 
  mode, 
  onToggleMode 
}) => {
  const statusColor = status === 'danger' ? 'text-red-500 bg-red-500/10 border-red-500/30' : 
                      status === 'warning' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' : 
                      'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

  const statusLabel = status === 'danger' ? 'CRITICAL' : status === 'warning' ? 'WARNING' : 'SAFE';

  return (
    <div className="w-full h-16 bg-cyber-800 border-b border-cyber-700 flex items-center justify-between px-6 shadow-md z-30 transition-all">
      {/* Metrics Group */}
      <div className="flex items-center gap-6">
        {/* Risk Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusColor} font-bold font-mono text-sm tracking-wider`}>
          {status === 'danger' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {statusLabel}
        </div>

        {/* Confidence */}
        <div className="flex flex-col">
           <span className="text-[10px] text-slate-500 font-mono uppercase">Confidence</span>
           <span className="text-sm font-bold text-white font-mono">{(confidence * 100).toFixed(1)}%</span>
        </div>

        {/* Latency */}
        <div className="flex flex-col">
           <span className="text-[10px] text-slate-500 font-mono uppercase">Latency</span>
           <span className="text-sm font-bold text-white font-mono flex items-center gap-1">
             <Clock className="w-3 h-3 text-cyan-500" />
             {latency}ms
           </span>
        </div>

        {/* Evidence Count */}
        <div className="flex flex-col">
           <span className="text-[10px] text-slate-500 font-mono uppercase">Evidence</span>
           <span className="text-sm font-bold text-white font-mono flex items-center gap-1">
             <Layers className="w-3 h-3 text-purple-500" />
             {evidenceCount} Items
           </span>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex relative">
        <button 
          onClick={() => onToggleMode('GUARD')}
          className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-300 ${mode === 'GUARD' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          GUARD
        </button>
        <button 
          onClick={() => onToggleMode('FORENSIC')}
          className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-300 ${mode === 'FORENSIC' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          FORENSIC
        </button>
        
        {/* Sliding Pill */}
        <div 
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-cyan-600 rounded shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-out ${mode === 'GUARD' ? 'left-1' : 'left-[calc(50%+2px)]'}`}
        ></div>
      </div>
    </div>
  );
};

export default SummaryStrip;