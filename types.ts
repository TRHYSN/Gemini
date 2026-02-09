export enum SecurityStatus {
  SAFE = 'safe',
  WARNING = 'warning',
  DANGER = 'danger'
}

export interface AudioEvent {
  timestamp: string;
  seconds: number;
  description: string;
}

// --- Step 1: Evidence Pack ---
export interface TimeWindow {
  t_start: number;
  t_end: number;
  p_anom: number; // Posterior probability of anomaly (0-1)
  acoustic_tag: string; // e.g., "shattering_glass", "footsteps"
  transcript_snippet: string;
}

export interface EvidencePack {
  audio_id: string;
  duration: number;
  windows: TimeWindow[];
  evidence_ids: string[]; // E01, E02... derived from high p_anom windows
}

// --- Step 2: Draft Report ---
export interface EvidenceMapItem {
  evidence_id: string;
  timestamp: string;
  description: string;
  significance: string;
}

export interface DraftReport {
  incident_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  narrative: string;
  evidence_map: EvidenceMapItem[];
  alternative_hypotheses: string[];
}

// --- Step 3: Audit Result ---
export interface AuditResult {
  passed: boolean;
  verdict: string;
  issues_found: string[];
  final_report: DraftReport; // Rewritten if needed
}

export interface User {
  username: string;
  role: 'admin' | 'user';
  token: string;
}

export interface LogEntry {
  id: string;
  time: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'AUDIT' | 'SYSTEM';
  message: string;
  details?: string;
}

export type DemoScenario = 'break-in' | 'accident' | 'noise' | 'custom';