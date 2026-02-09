import React, { useMemo } from 'react';
import { TimeWindow } from '../types';

interface Props {
  windows: TimeWindow[];
  duration: number;
}

const BayesianChart: React.FC<Props> = ({ windows, duration }) => {
  const height = 150;
  const width = 600;
  const padding = 20;

  // Generate Path Data
  const pathData = useMemo(() => {
    if (!windows.length) return "";
    
    // Scale functions
    const scaleX = (t: number) => (t / duration) * (width - 2 * padding) + padding;
    const scaleY = (p: number) => height - padding - (p * (height - 2 * padding));

    let d = `M ${scaleX(0)} ${scaleY(windows[0].p_anom)}`;
    
    // Smooth curve using basic Catmull-Rom or simple Line for this demo
    windows.forEach((w) => {
      // Use center of window for point
      const midT = (w.t_start + w.t_end) / 2;
      d += ` L ${scaleX(midT)} ${scaleY(w.p_anom)}`;
    });

    return d;
  }, [windows, duration]);

  // Generate Area Fill
  const areaData = useMemo(() => {
    if (!pathData) return "";
    return `${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;
  }, [pathData]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden select-none">
      <div className="absolute top-2 left-2 text-[10px] text-cyan-500 font-mono tracking-widest z-10">
        ANOMALY POSTERIOR P(anom|x)
      </div>
      
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grid Lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
        
        {/* Threshold Line (Hysteresis ON) */}
        <line x1={padding} y1={height - padding - (0.75 * (height - 2*padding))} x2={width - padding} y2={height - padding - (0.75 * (height - 2*padding))} stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

        {/* Area Fill */}
        <path d={areaData} fill="url(#gradient)" opacity="0.2" />
        
        {/* Line Stroke */}
        <path d={pathData} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Points & Tooltips (simulated visual) */}
        {windows.map((w, i) => {
           const midT = (w.t_start + w.t_end) / 2;
           const cx = (midT / duration) * (width - 2 * padding) + padding;
           const cy = height - padding - (w.p_anom * (height - 2 * padding));
           
           return (
             <g key={i}>
               <circle cx={cx} cy={cy} r={w.p_anom > 0.75 ? 3 : 1} fill={w.p_anom > 0.75 ? "#ef4444" : "#06b6d4"} />
               {w.p_anom > 0.6 && (
                 <text x={cx} y={cy - 10} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">
                   {w.acoustic_tag}
                 </text>
               )}
             </g>
           )
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default BayesianChart;
