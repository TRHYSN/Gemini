import React, { useState, useEffect } from 'react';
import { User, DemoScenario, EvidencePack, DraftReport, AuditResult } from '../types';
import BayesianChart from '../components/BayesianChart';
import ActionGate from '../components/ActionGate';
import MapWidget from '../components/MapWidget';
import SummaryStrip from '../components/SummaryStrip';
import GuardView from '../components/GuardView';
import ForensicLedger from '../components/ForensicLedger';
import EventList from '../components/EventList';
import PipelineStatus from '../components/PipelineStatus';
import Waveform from '../components/Waveform';
import { generateEvidencePack, generateDraftReport, runAudit } from '../services/geminiService';
import { Settings, Upload, Activity, PlayCircle, Radio } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  // --- State ---
  const [mode, setMode] = useState<'GUARD' | 'FORENSIC'>('GUARD');
  // Default to break-in for Implicit Demo Mode
  const [activeScenario, setActiveScenario] = useState<DemoScenario>('break-in'); 
  const [pipelineState, setPipelineState] = useState<'IDLE' | 'ANALYZING' | 'DRAFTING' | 'AUDITING' | 'COMPLETE'>('IDLE');
  
  // Data
  const [evidence, setEvidence] = useState<EvidencePack | null>(null);
  const [draft, setDraft] = useState<DraftReport | null>(null);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [latency, setLatency] = useState(0);
  const [confidence, setConfidence] = useState(0);

  // UI State
  const [activeTab, setActiveTab] = useState<'evidence' | 'draft' | 'check' | 'verdict'>('evidence');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [noiseLevel, setNoiseLevel] = useState(50);

  // --- Handlers ---
  const runPipeline = async () => {
    setPipelineState('ANALYZING');
    setEvidence(null);
    setDraft(null);
    setAudit(null);
    setLatency(0);

    const startTime = Date.now();

    try {
      // Step 1: Analyze
      // Note: generateEvidencePack handles fallback logic internally for reliability
      const ev = await generateEvidencePack(null, activeScenario);
      setEvidence(ev);
      setPipelineState('DRAFTING');
      
      // Update latency simulation
      setLatency(Date.now() - startTime);

      // Step 2: Draft
      const dr = await generateDraftReport(ev, activeScenario);
      setDraft(dr);
      setPipelineState('AUDITING');
      
      setLatency(Date.now() - startTime);

      // Step 3: Audit
      const au = await runAudit(dr, activeScenario);
      setAudit(au);
      setPipelineState('COMPLETE');
      
      const finalLatency = Date.now() - startTime;
      setLatency(finalLatency);

      // Set initial confidence/status based on result
      if (au.final_report.severity === 'CRITICAL') setConfidence(0.95);
      else if (au.final_report.severity === 'HIGH') setConfidence(0.85);
      else setConfidence(0.99); // Safe is high confidence

      // Auto-switch view if in Guard mode to show something happened, 
      // but if user is in Forensic, keep them there.
      if (mode === 'GUARD') {
         // Optional: we could auto-switch, but Guard View updates automatically via props
      }

    } catch (e) {
      console.error(e);
      setPipelineState('IDLE');
    }
  };

  const handleToggleMode = (newMode: 'GUARD' | 'FORENSIC') => {
    setMode(newMode);
  };

  // Derived Status
  const currentStatus = audit?.final_report.severity === 'CRITICAL' ? 'danger' : 
                        audit?.final_report.severity === 'HIGH' ? 'warning' : 'safe';

  // Construct events for Guard Mode feed
  const recentEvents = evidence?.windows
    .filter(w => w.p_anom > 0.6)
    .map(w => ({ timestamp: `00:${Math.floor(w.t_start).toString().padStart(2,'0')}`, seconds: w.t_start, description: w.acoustic_tag })) 
    || [];

  const handleStepClick = (tab: 'evidence' | 'draft' | 'check') => {
    setActiveTab(tab);
  };

  const handleEventSelect = (id: string) => {
    setSelectedEventId(id);
    setActiveTab('evidence'); // Switch ledger to evidence to show details
  };

  return (
    <div className="flex flex-col h-screen bg-cyber-900 text-slate-200 overflow-hidden font-sans">
      
      {/* HEADER + SUMMARY STRIP */}
      <div className="flex-none z-50">
        <header className="h-14 border-b border-cyber-700 bg-cyber-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white tracking-wider">ECOSENSE <span className="text-slate-500 text-xs ml-2 font-mono">AUDITOR PRO V3</span></span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
             <span className="text-cyan-500">CONN: SECURE</span>
             <button onClick={onLogout} className="text-slate-400 hover:text-white">LOGOUT</button>
          </div>
        </header>

        <SummaryStrip 
          status={currentStatus}
          confidence={confidence}
          latency={latency}
          evidenceCount={evidence?.evidence_ids.length || 0}
          mode={mode}
          onToggleMode={handleToggleMode}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* GUARD MODE VIEW */}
        <div className={`absolute inset-0 z-20 bg-cyber-900 transition-all duration-500 ease-in-out ${mode === 'GUARD' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <GuardView 
            status={currentStatus}
            narrative={audit?.final_report.narrative || "System Initializing..."}
            recentEvents={recentEvents}
            onViewEvidence={() => setMode('FORENSIC')}
          />
        </div>

        {/* FORENSIC MODE VIEW */}
        <div className={`absolute inset-0 z-10 grid grid-cols-12 gap-0 transition-all duration-500 ease-in-out ${mode === 'FORENSIC' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          
          {/* LEFT PANEL: Input & Pipeline (3 cols) */}
          <div className="col-span-3 bg-cyber-800/50 border-r border-cyber-700 p-4 flex flex-col gap-6 overflow-y-auto">
             {/* Input Source */}
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                 <Settings className="w-3 h-3" /> Input Source
               </h3>
               
               {/* Waveform Visualization */}
               <Waveform isListening={activeScenario === 'custom' || pipelineState === 'ANALYZING'} />

               {/* New Source Selector for Demo Mode */}
               <div className="space-y-3">
                 <div className="relative">
                   <select 
                      value={activeScenario}
                      onChange={(e) => setActiveScenario(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded px-3 py-2 appearance-none focus:border-cyan-500 focus:outline-none"
                   >
                      <option value="break-in">Signal Source A: Residential (Break-in)</option>
                      <option value="accident">Signal Source B: Domestic (Accident)</option>
                      <option value="noise">Signal Source C: Ambient (Noise)</option>
                      <option value="custom">Live Microphone Feed (Beta)</option>
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <Radio className="w-3 h-3 text-cyan-500" />
                   </div>
                 </div>

                 <button 
                    onClick={runPipeline}
                    disabled={pipelineState !== 'IDLE' && pipelineState !== 'COMPLETE'}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                 >
                    {pipelineState === 'IDLE' || pipelineState === 'COMPLETE' ? (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        ANALYZE STREAM
                      </>
                    ) : (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        PROCESSING...
                      </>
                    )}
                 </button>

                 {/* Required Disclaimer */}
                 <div className="text-[10px] text-slate-500 text-center font-mono leading-tight">
                    Demo mode uses bundled samples for reliability.
                 </div>
               </div>

               <div>
                 <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                   <span>SENSITIVITY THRESHOLD</span>
                   <span>{noiseLevel}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" max="100" 
                   value={noiseLevel} 
                   onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                   className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                 />
               </div>
            </div>

            {/* Pipeline Stepper */}
            <div className="mt-4">
              <PipelineStatus state={pipelineState} onStepClick={handleStepClick} />
            </div>
          </div>

          {/* CENTER PANEL: Chart & List (5 cols) */}
          <div className="col-span-5 bg-cyber-900 flex flex-col p-4 gap-4 overflow-y-auto">
            {/* Chart */}
            <div className="h-64 bg-cyber-800/30 rounded-lg border border-slate-700 p-4 flex flex-col">
               <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                   Bayesian Anomaly Posterior
                 </h2>
               </div>
               <div className="flex-1 relative">
                 {evidence ? (
                   <BayesianChart windows={evidence.windows} duration={evidence.duration} />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-xs">
                     WAITING FOR SIGNAL...
                   </div>
                 )}
               </div>
            </div>

            {/* Event List */}
            <div className="flex-1 overflow-y-auto min-h-[200px]">
              {evidence ? (
                <EventList 
                  evidence={evidence} 
                  selectedEventId={selectedEventId}
                  onSelectEvent={handleEventSelect}
                />
              ) : (
                <div className="text-center mt-10 text-xs text-slate-600 font-mono">No events analyzed yet.</div>
              )}
            </div>

            {/* Small Map Widget Context */}
            <div className="h-32 rounded-lg overflow-hidden border border-slate-700">
               <MapWidget status={currentStatus} />
            </div>
          </div>

          {/* RIGHT PANEL: Ledger & Actions (4 cols) */}
          <div className="col-span-4 bg-cyber-800/50 border-l border-cyber-700 p-4 flex flex-col gap-4 overflow-hidden">
             
             {/* Ledger Tabs */}
             <div className="flex-1 overflow-hidden">
                <ForensicLedger 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  evidence={evidence}
                  draft={draft}
                  audit={audit}
                />
             </div>

             {/* Action Gate */}
             <div className="h-auto bg-slate-900/50 rounded-lg border border-slate-700 p-4">
                <ActionGate severity={audit?.final_report.severity || 'LOW'} />
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;