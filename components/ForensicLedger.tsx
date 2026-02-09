import React from 'react';
import { Copy, FileJson, FileText, CheckCircle, Gavel } from 'lucide-react';
import { EvidencePack, DraftReport, AuditResult } from '../types';

interface ForensicLedgerProps {
  activeTab: 'evidence' | 'draft' | 'check' | 'verdict';
  setActiveTab: (tab: 'evidence' | 'draft' | 'check' | 'verdict') => void;
  evidence: EvidencePack | null;
  draft: DraftReport | null;
  audit: AuditResult | null;
}

const ForensicLedger: React.FC<ForensicLedgerProps> = ({ activeTab, setActiveTab, evidence, draft, audit }) => {
  
  const tabs = [
    { id: 'evidence', icon: FileJson, label: 'EVIDENCE' },
    { id: 'draft', icon: FileText, label: 'DRAFT' },
    { id: 'check', icon: CheckCircle, label: 'AUDIT' },
    { id: 'verdict', icon: Gavel, label: 'VERDICT' },
  ] as const;

  const getContent = () => {
    switch(activeTab) {
      case 'evidence': return evidence ? JSON.stringify(evidence, null, 2) : '// No evidence data...';
      case 'draft': return draft ? JSON.stringify(draft, null, 2) : '// Waiting for draft generation...';
      case 'check': return audit ? JSON.stringify({ passed: audit.passed, issues: audit.issues_found }, null, 2) : '// Waiting for audit...';
      case 'verdict': return audit ? JSON.stringify(audit.final_report, null, 2) : '// Final verdict pending...';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getContent());
  };

  return (
    <div className="flex flex-col h-full bg-cyber-800/30 rounded-lg border border-slate-700 overflow-hidden">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-900/50">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold tracking-wider transition-colors ${
                isActive 
                  ? 'text-cyan-400 bg-cyan-900/20 border-b-2 border-cyan-500' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/30 border-b border-slate-700/50">
        <span className="text-[10px] font-mono text-slate-400">JSON_VIEWER // {activeTab.toUpperCase()}</span>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-[10px] text-cyan-500 hover:text-white transition-colors"
        >
          <Copy className="w-3 h-3" /> COPY
        </button>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-hidden relative group">
        <pre className="absolute inset-0 p-4 text-[10px] font-mono text-slate-400 overflow-auto custom-scrollbar selection:bg-cyan-900/50">
          {getContent()}
        </pre>
      </div>
    </div>
  );
};

export default ForensicLedger;