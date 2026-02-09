import React from 'react';
import { Cpu, FileText, CheckCircle, ArrowDown } from 'lucide-react';

interface PipelineStatusProps {
  state: 'IDLE' | 'ANALYZING' | 'DRAFTING' | 'AUDITING' | 'COMPLETE';
  onStepClick: (step: 'evidence' | 'draft' | 'check') => void;
}

const PipelineStatus: React.FC<PipelineStatusProps> = ({ state, onStepClick }) => {
  const getStatus = (target: string) => {
    const order = ['IDLE', 'ANALYZING', 'DRAFTING', 'AUDITING', 'COMPLETE'];
    const currIdx = order.indexOf(state);
    const targetIdx = order.indexOf(target);
    
    if (currIdx > targetIdx) return 'complete';
    if (currIdx === targetIdx) return 'active';
    return 'pending';
  };

  const Step = ({ id, label, icon: Icon, targetState, linkTab, duration }: any) => {
    const status = getStatus(targetState);
    const isActive = status === 'active';
    const isComplete = status === 'complete';

    return (
      <div className="relative pl-4 pb-6 last:pb-0 border-l border-slate-700 last:border-0 group">
        {/* Dot */}
        <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${
          isActive ? 'bg-cyan-500 border-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.8)] scale-125' : 
          isComplete ? 'bg-emerald-500 border-emerald-900' : 
          'bg-slate-800 border-slate-600'
        }`}></div>

        {/* Content */}
        <button 
          onClick={() => isComplete && onStepClick(linkTab)}
          className={`text-left w-full transition-all ${isComplete ? 'hover:translate-x-1 cursor-pointer' : 'cursor-default'}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isActive ? 'text-cyan-400 animate-pulse' : 
              isComplete ? 'text-emerald-400' : 'text-slate-600'
            }`}>
              {label}
            </span>
            {duration && (isComplete || isActive) && (
              <span className="text-[9px] font-mono text-slate-500">{duration}ms</span>
            )}
          </div>
          
          <div className={`text-[10px] mt-1 flex items-center gap-2 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
            <Icon className="w-3 h-3" />
            <span>{isActive ? 'Processing...' : isComplete ? 'Complete' : 'Pending'}</span>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-black/20 rounded-xl p-4 border border-slate-800/50">
      <div className="text-[10px] text-slate-500 font-mono mb-4 uppercase tracking-widest">Pipeline Trace</div>
      <div className="flex flex-col">
        <Step 
          id="1" label="Signal Analysis" icon={Cpu} 
          targetState="ANALYZING" linkTab="evidence" duration={320} 
        />
        <Step 
          id="2" label="Narrative Gen" icon={FileText} 
          targetState="DRAFTING" linkTab="draft" duration={840} 
        />
        <Step 
          id="3" label="Safety Audit" icon={CheckCircle} 
          targetState="AUDITING" linkTab="check" duration={210} 
        />
      </div>
    </div>
  );
};

export default PipelineStatus;