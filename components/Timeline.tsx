import React from 'react';
import { AudioEvent } from '../types';

interface TimelineProps {
  duration: number; // in seconds
  events: AudioEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ duration, events }) => {
  // Ensure duration is at least 1 second to avoid division by zero
  const safeDuration = Math.max(duration, 1);

  return (
    <div className="relative w-full h-24 bg-slate-900 rounded-lg border border-slate-700 mt-4 select-none overflow-hidden">
      {/* Time Rulers */}
      <div className="absolute top-0 left-0 w-full h-6 border-b border-slate-700 flex justify-between px-2 text-[10px] text-slate-500 font-mono items-center bg-slate-800">
        <span>00:00</span>
        <span>TIMELINE SEQUENCE</span>
        <span>{`00:${safeDuration.toString().padStart(2, '0')}`}</span>
      </div>

      {/* Track */}
      <div className="absolute top-8 left-0 right-0 h-10 flex items-center px-4">
        <div className="w-full h-1 bg-slate-700 rounded relative">
          
          {/* Progress / Waveform placeholder line */}
          <div className="absolute left-0 top-0 bottom-0 bg-cyan-900/50 w-full"></div>

          {/* Event Markers */}
          {events.map((evt, idx) => {
            const positionPercent = Math.min((evt.seconds / safeDuration) * 100, 100);
            
            return (
              <div 
                key={idx}
                className="absolute top-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${positionPercent}%` }}
              >
                {/* Marker Pin */}
                <div className={`w-3 h-3 rounded-full border-2 transform -translate-x-1/2 transition-all duration-300 ${
                  evt.description.includes('破') || evt.description.includes('叫') || evt.description.includes('枪') 
                    ? 'bg-red-500 border-red-900 shadow-[0_0_10px_rgba(239,68,68,0.8)]' 
                    : 'bg-yellow-400 border-yellow-900 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                }`}></div>
                
                {/* Hover Tooltip (Timeline Style) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  <div className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-[10px] text-white font-mono shadow-xl flex flex-col items-center">
                    <span className="text-cyan-400 font-bold">{evt.timestamp}</span>
                    <span>{evt.description}</span>
                    <div className="w-2 h-2 bg-slate-800 border-r border-b border-slate-600 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                  </div>
                </div>

                {/* Vertical Guide Line */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-600/50 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Decoration */}
      <div className="absolute bottom-1 right-2 text-[9px] text-slate-600 font-mono tracking-widest">
        SEMANTIC_LAYER_01
      </div>
    </div>
  );
};

export default Timeline;