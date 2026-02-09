import React from 'react';
import { EvidencePack } from '../types';
import { Play } from 'lucide-react';

interface EventListProps {
  evidence: EvidencePack;
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
}

const EventList: React.FC<EventListProps> = ({ evidence, selectedEventId, onSelectEvent }) => {
  // Filter only windows with anomaly probability > 0.6 or those explicitly in evidence_ids
  // For demo data, we might want to map the evidence_ids to specific windows or just show high prob windows
  const events = evidence.windows.filter(w => w.p_anom > 0.6).map((w, idx) => ({
    id: `E0${idx + 1}`,
    ...w
  }));

  return (
    <div className="flex flex-col gap-1 mt-4">
      <div className="text-[10px] text-slate-500 font-mono uppercase px-2 mb-1 flex justify-between">
        <span>Detected Event Timeline</span>
        <span>{events.length} Events</span>
      </div>
      
      <div className="space-y-1">
        {events.map((evt) => {
          const isSelected = selectedEventId === evt.id;
          return (
            <button
              key={evt.id}
              onClick={() => onSelectEvent(evt.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded border transition-all duration-200 text-left ${
                isSelected 
                  ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-1 h-8 rounded-full ${evt.p_anom > 0.8 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                 <div>
                   <div className="flex items-center gap-2">
                     <span className={`text-xs font-bold font-mono ${isSelected ? 'text-cyan-400' : 'text-slate-300'}`}>
                       {evt.id}
                     </span>
                     <span className="text-[10px] text-slate-500 font-mono">
                       | {`00:${Math.floor(evt.t_start).toString().padStart(2, '0')} - 00:${Math.floor(evt.t_end).toString().padStart(2, '0')}`}
                     </span>
                   </div>
                   <div className="text-xs text-slate-400 font-medium">
                     {evt.acoustic_tag.replace(/_/g, ' ')}
                   </div>
                 </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-mono font-bold ${evt.p_anom > 0.8 ? 'text-red-400' : 'text-yellow-400'}`}>
                  P={(evt.p_anom).toFixed(2)}
                </span>
                {isSelected && <Play className="w-3 h-3 text-cyan-500 mt-1 animate-pulse" />}
              </div>
            </button>
          );
        })}
        
        {events.length === 0 && (
          <div className="text-center py-4 text-xs text-slate-600 font-mono italic">
            No significant anomaly events detected.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;