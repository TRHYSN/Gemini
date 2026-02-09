import React, { useState } from 'react';
import { Lock, Smartphone, Camera, Bell, Shield, Zap } from 'lucide-react';

interface Props {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const ActionGate: React.FC<Props> = ({ severity }) => {
  const [confirming, setConfirming] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  const handleAction = (action: string, highRisk: boolean) => {
    if (highRisk) {
      setConfirming(action);
      setConfirmInput("");
    } else {
      execute(action);
    }
  };

  const execute = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog(prev => [`[${timestamp}] EXECUTED: ${action}`, ...prev]);
    setConfirming(null);
    if (action === "LOCKDOWN_PERIMETER") setLocked(true);
  };

  const handleConfirm = () => {
    if (confirmInput === "CONFIRM") {
      if (confirming) execute(confirming);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* Low Risk Zone (Green) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
           <Zap className="w-3 h-3" /> Low Risk Actions
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handleAction("NOTIFY_OWNER", false)}
            className="flex flex-col items-center justify-center p-3 bg-emerald-900/10 hover:bg-emerald-900/20 text-emerald-400 text-xs font-bold rounded border border-emerald-900/30 transition-colors"
          >
            <Bell className="w-4 h-4 mb-1" /> NOTIFY
          </button>
          <button 
            onClick={() => handleAction("SNAPSHOT_CAM_01", false)}
            className="flex flex-col items-center justify-center p-3 bg-emerald-900/10 hover:bg-emerald-900/20 text-emerald-400 text-xs font-bold rounded border border-emerald-900/30 transition-colors"
          >
            <Camera className="w-4 h-4 mb-1" /> SNAPSHOT
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-slate-800"></div>

      {/* High Risk Zone (Red) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">
           <Shield className="w-3 h-3" /> High Risk Protocols
        </div>
        
        {/* Input Gate */}
        {confirming && (
          <div className="bg-red-900/10 border border-red-500/50 p-2 rounded animate-in fade-in slide-in-from-bottom-2 duration-200 mb-2">
            <div className="text-[9px] text-red-400 font-bold mb-1 uppercase">Type "CONFIRM" to execute</div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={confirmInput}
                onChange={e => setConfirmInput(e.target.value)}
                className="bg-black/50 border border-red-500/30 text-white text-xs px-2 py-1 rounded flex-1 outline-none uppercase"
                placeholder="CONFIRM"
                autoFocus
              />
              <button 
                onClick={handleConfirm}
                disabled={confirmInput !== "CONFIRM"}
                className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded disabled:opacity-50"
              >
                EXEC
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => handleAction("LOCKDOWN_PERIMETER", true)}
            disabled={severity === 'LOW' || locked}
            className={`flex items-center justify-between px-4 py-3 text-xs font-bold rounded border transition-colors ${
              locked 
                ? 'bg-red-900/40 border-red-500 text-white cursor-not-allowed' 
                : 'bg-red-900/10 border-red-900/30 text-red-400 hover:bg-red-900/20 hover:border-red-500/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {locked ? 'PERIMETER LOCKED' : 'LOCK EXITS'}
            </div>
            {!locked && <div className="text-[9px] bg-red-900/40 px-1 rounded border border-red-800">REQ. AUTH</div>}
          </button>

          <button 
            onClick={() => handleAction("DISPATCH_LE", true)}
            disabled={severity !== 'CRITICAL' && severity !== 'HIGH'}
            className="flex items-center justify-between px-4 py-3 bg-red-900/10 hover:bg-red-900/20 text-red-400 text-xs font-bold rounded border border-red-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              DISPATCH PATROL
            </div>
             <div className="text-[9px] bg-red-900/40 px-1 rounded border border-red-800">REQ. AUTH</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionGate;