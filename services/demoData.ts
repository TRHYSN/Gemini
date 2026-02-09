import { EvidencePack, DraftReport, AuditResult } from '../types';

// Mock Data for "Break-in" Scenario
export const DEMO_BREAK_IN: { evidence: EvidencePack, draft: DraftReport, audit: AuditResult } = {
  evidence: {
    audio_id: "demo_break_in_001",
    duration: 12,
    evidence_ids: ["E01", "E02"],
    windows: [
      { t_start: 0, t_end: 2, p_anom: 0.05, acoustic_tag: "ambient_hum", transcript_snippet: "[silence]" },
      { t_start: 2, t_end: 4, p_anom: 0.12, acoustic_tag: "rustling", transcript_snippet: "..." },
      { t_start: 4, t_end: 6, p_anom: 0.88, acoustic_tag: "glass_shatter", transcript_snippet: "[loud crash]" },
      { t_start: 6, t_end: 8, p_anom: 0.92, acoustic_tag: "heavy_footsteps", transcript_snippet: "Go, go, get it!" },
      { t_start: 8, t_end: 10, p_anom: 0.65, acoustic_tag: "wood_creak", transcript_snippet: "[rapid movement]" },
      { t_start: 10, t_end: 12, p_anom: 0.10, acoustic_tag: "ambient_hum", transcript_snippet: "..." }
    ]
  },
  draft: {
    incident_type: "Forced Entry / Burglary",
    severity: "CRITICAL",
    narrative: "Audio analysis indicates a high-probability forced entry event. A distinct glass shattering sound (E01) is immediately followed by hurried footsteps and hushed aggressive vocalizations (E02), suggesting unauthorized human presence.",
    evidence_map: [
      { evidence_id: "E01", timestamp: "00:04", description: "High-amplitude glass breakage frequency signature", significance: "Primary breach indicator" },
      { evidence_id: "E02", timestamp: "00:06", description: "Voice detected: 'Go, go, get it!'", significance: "Confirms intent/multiple actors" }
    ],
    alternative_hypotheses: ["Accidental object breakage by pet", "TV/Media playback"]
  },
  audit: {
    passed: true,
    verdict: "CONSISTENT",
    issues_found: [],
    final_report: {
      incident_type: "Forced Entry / Burglary",
      severity: "CRITICAL",
      narrative: "CONFIRMED AUDIT: Audio signature matches forced entry. Glass breakage (E01) combined with directive speech (E02) eliminates accidental causes with 95% confidence.",
      evidence_map: [
        { evidence_id: "E01", timestamp: "00:04", description: "Glass shattering", significance: "Breach" },
        { evidence_id: "E02", timestamp: "00:06", description: "Male voice: 'Go, go, get it!'", significance: "Intent" }
      ],
      alternative_hypotheses: []
    }
  }
};

// Mock Data for "Accident" Scenario
export const DEMO_ACCIDENT: { evidence: EvidencePack, draft: DraftReport, audit: AuditResult } = {
  evidence: {
    audio_id: "demo_accident_001",
    duration: 10,
    evidence_ids: ["E01"],
    windows: [
      { t_start: 0, t_end: 2, p_anom: 0.02, acoustic_tag: "typing", transcript_snippet: "[typing sounds]" },
      { t_start: 2, t_end: 4, p_anom: 0.05, acoustic_tag: "chair_squeak", transcript_snippet: "..." },
      { t_start: 4, t_end: 6, p_anom: 0.85, acoustic_tag: "thud_grunt", transcript_snippet: "Ouch! My leg!" },
      { t_start: 6, t_end: 8, p_anom: 0.70, acoustic_tag: "groaning", transcript_snippet: "Help..." },
      { t_start: 8, t_end: 10, p_anom: 0.40, acoustic_tag: "heavy_breathing", transcript_snippet: "[groan]" }
    ]
  },
  draft: {
    incident_type: "Personal Injury / Fall",
    severity: "HIGH",
    narrative: "A sudden blunt impact sound is followed by immediate vocalizations of pain ('Ouch', 'Help'). The acoustic context suggests a fall or collision in a domestic setting.",
    evidence_map: [
      { evidence_id: "E01", timestamp: "00:04", description: "Impact thud + Voice 'Ouch!'", significance: "Injury Event" }
    ],
    alternative_hypotheses: ["Gaming/Media noise", "Prank"]
  },
  audit: {
    passed: true,
    verdict: "CONSISTENT",
    issues_found: [],
    final_report: {
      incident_type: "Medical Emergency",
      severity: "HIGH",
      narrative: "AUDITED: Subject appears to have fallen. Distress vocals are authentic. No hostile second party detected.",
      evidence_map: [
        { evidence_id: "E01", timestamp: "00:04", description: "Impact + Distress Call", significance: "Fall detected" }
      ],
      alternative_hypotheses: []
    }
  }
};

// Mock Data for "Noise Nuisance"
export const DEMO_NOISE: { evidence: EvidencePack, draft: DraftReport, audit: AuditResult } = {
  evidence: {
    audio_id: "demo_noise_001",
    duration: 10,
    evidence_ids: [],
    windows: [
      { t_start: 0, t_end: 2, p_anom: 0.30, acoustic_tag: "traffic_drone", transcript_snippet: "..." },
      { t_start: 2, t_end: 4, p_anom: 0.45, acoustic_tag: "siren_distant", transcript_snippet: "[siren]" },
      { t_start: 4, t_end: 6, p_anom: 0.20, acoustic_tag: "traffic_drone", transcript_snippet: "..." },
      { t_start: 6, t_end: 8, p_anom: 0.25, acoustic_tag: "horn", transcript_snippet: "[honk]" },
      { t_start: 8, t_end: 10, p_anom: 0.30, acoustic_tag: "traffic_drone", transcript_snippet: "..." }
    ]
  },
  draft: {
    incident_type: "Environmental Noise",
    severity: "LOW",
    narrative: "Routine urban background noise detected. Distant sirens and traffic flow. No acute security threats identified.",
    evidence_map: [],
    alternative_hypotheses: []
  },
  audit: {
    passed: true,
    verdict: "CONSISTENT",
    issues_found: [],
    final_report: {
      incident_type: "None / Ambient",
      severity: "LOW",
      narrative: "AUDITED: Normal baseline activity. No action required.",
      evidence_map: [],
      alternative_hypotheses: []
    }
  }
};
