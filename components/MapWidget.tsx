import React from 'react';
import { Locate, MapPin, Navigation } from 'lucide-react';

interface MapWidgetProps {
  status: 'safe' | 'warning' | 'danger';
  lat?: number;
  lng?: number;
}

const MapWidget: React.FC<MapWidgetProps> = ({ status, lat = 34.0522, lng = -118.2437 }) => {
  const statusColor = status === 'danger' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden relative border border-slate-700 group">
      {/* Fake Map Grid Background */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>
      
      {/* Decorative Map Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 50 L 150 150 L 300 100" stroke="#06b6d4" strokeWidth="1" fill="none" />
        <path d="M 200 200 L 250 250" stroke="#334155" strokeWidth="2" fill="none" />
        <circle cx="50%" cy="50%" r="100" stroke="#334155" strokeWidth="1" fill="none" strokeDasharray="5,5" />
      </svg>

      {/* Central Marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
         <div className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-${status === 'danger' ? 'red' : status === 'warning' ? 'yellow' : 'emerald'}-500/20 animate-pulse`}>
            <MapPin className="w-5 h-5" style={{ color: statusColor }} />
            <div className="absolute w-12 h-12 rounded-full border border-current opacity-50 animate-ping" style={{ color: statusColor }}></div>
         </div>
         <div className="mt-2 text-[10px] font-mono text-white bg-black/50 px-2 py-0.5 rounded border border-slate-700">
           {lat.toFixed(4)}, {lng.toFixed(4)}
         </div>
      </div>

      {/* UI Overlays */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
         <div className="bg-slate-800/80 backdrop-blur px-2 py-1 rounded border border-slate-600 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
           <Locate className="w-3 h-3" />
           LIVE TRACKING
         </div>
      </div>

      <div className="absolute bottom-3 right-3">
         <Navigation className="w-5 h-5 text-slate-500 transform rotate-45" />
      </div>

      {/* Scan Line Animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-4 w-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>
    </div>
  );
};

export default MapWidget;