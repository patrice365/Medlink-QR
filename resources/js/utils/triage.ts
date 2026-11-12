import type { PatientRecord } from '../types/patient';
import { computeAge, fullName } from './patient';

export type TriageLevel = 'Emergent' | 'Urgent' | 'Non-urgent' | 'Pending';

export interface TriageFlag {
  label: string;
  detail: string;
  tone: 'critical' | 'caution';
}

export interface TriageResult {
  level: TriageLevel;
  score: number;
  flags: TriageFlag[];
  summary: string;
  recommendation: string;
}

const CRITICAL_TERMS = [
'chest pain',
'difficulty breathing',
'shortness of breath',
'unconscious',
'unresponsive',
'seizure',
'convulsion',
'severe bleeding',
'fainted',
'anaphylaxis',
'head injury'];


const CAUTION_TERMS = [
'fever',
'vomiting',
'dizziness',
'headache',
'abdominal pain',
'wound',
'sprain',
'wheezing',
'asthma',
'diarrhea',
'rash'];


const RISK_HISTORY = ['Bronchial Asthma', 'Epilepsy (Convulsion)', 'Diabetes', 'Hypertension'];

const RECOMMENDATIONS: Record<Exclude<TriageLevel, 'Pending'>, string> = {
  Emergent:
  'Attend immediately. Notify the examining physician, prepare emergency response, and arrange hospital transport if needed.',
  Urgent: 'See within 30 minutes. Re-check vital signs every 15 minutes and escalate if any worsen.',
  'Non-urgent': 'Routine care at the clinic. Advise follow-up if symptoms persist or worsen.'
};

function toNumber(value: string): number | null {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export function assessTriage(p: PatientRecord): TriageResult {
  const c = p.clinical;
  const complaint = c.chiefComplaint.trim();
  const hasVitals = [c.temp, c.hr, c.rr, c.bp].some((v) => v.trim());

  if (!complaint && !hasVitals) {
    return {
      level: 'Pending',
      score: 0,
      flags: [],
      summary: 'No clinic visit recorded yet. Add a chief complaint and vital signs to generate a triage summary.',
      recommendation: ''
    };
  }

  let score = 0;
  const flags: TriageFlag[] = [];

  const temp = toNumber(c.temp);
  if (temp !== null) {
    if (temp >= 39.5) {
      score += 3;
      flags.push({ label: 'High fever', detail: `${temp}°C`, tone: 'critical' });
    } else if (temp >= 38) {
      score += 1;
      flags.push({ label: 'Fever', detail: `${temp}°C`, tone: 'caution' });
    } else if (temp < 35.5) {
      score += 2;
      flags.push({ label: 'Low temperature', detail: `${temp}°C`, tone: 'critical' });
    }
  }

  const hr = toNumber(c.hr);
  if (hr !== null) {
    if (hr > 130) {
      score += 3;
      flags.push({ label: 'Very fast heart rate', detail: `${hr} bpm`, tone: 'critical' });
    } else if (hr > 110) {
      score += 2;
      flags.push({ label: 'Fast heart rate', detail: `${hr} bpm`, tone: 'caution' });
    } else if (hr < 50) {
      score += 2;
      flags.push({ label: 'Slow heart rate', detail: `${hr} bpm`, tone: 'caution' });
    }
  }

  const rr = toNumber(c.rr);
  if (rr !== null) {
    if (rr > 28 || rr < 10) {
      score += 3;
      flags.push({ label: 'Abnormal breathing rate', detail: `${rr} cpm`, tone: 'critical' });
    } else if (rr > 22) {
      score += 2;
      flags.push({ label: 'Elevated breathing rate', detail: `${rr} cpm`, tone: 'caution' });
    }
  }

  const [sys, dia] = c.bp.split('/').map((v) => toNumber(v ?? ''));
  if (sys !== null && sys !== undefined) {
    if (sys >= 180 || (dia ?? 0) >= 120) {
      score += 3;
      flags.push({ label: 'Severely high blood pressure', detail: `${c.bp} mmHg`, tone: 'critical' });
    } else if (sys >= 140) {
      score += 1;
      flags.push({ label: 'High blood pressure', detail: `${c.bp} mmHg`, tone: 'caution' });
    } else if (sys < 90) {
      score += 2;
      flags.push({ label: 'Low blood pressure', detail: `${c.bp} mmHg`, tone: 'caution' });
    }
  }

  const lower = complaint.toLowerCase();
  const critical = CRITICAL_TERMS.filter((t) => lower.includes(t));
  if (critical.length) {
    score += 3;
    flags.push({ label: 'Red-flag complaint', detail: critical.join(', '), tone: 'critical' });
  }
  const caution = CAUTION_TERMS.filter((t) => lower.includes(t));
  if (caution.length) {
    score += 1;
    flags.push({ label: 'Symptoms to watch', detail: caution.join(', '), tone: 'caution' });
  }

  const risks = RISK_HISTORY.filter((r) => r in p.pastHistory);
  if (risks.length && score > 0) {
    score += 1;
    flags.push({ label: 'Relevant history', detail: risks.join(', '), tone: 'caution' });
  }
  if (p.allergy.trim()) {
    flags.push({ label: 'Known allergy', detail: p.allergy.trim(), tone: 'caution' });
  }

  const level: TriageLevel = score >= 5 ? 'Emergent' : score >= 2 ? 'Urgent' : 'Non-urgent';

  const age = computeAge(p.dateOfBirth);
  const who = `${fullName(p)}, ${age ?? '—'}-year-old ${p.sex ? p.sex.toLowerCase() : ''} ${p.program.trim() || 'patient'}`;
  const complaintText = complaint ? complaint.charAt(0).toLowerCase() + complaint.slice(1) : 'no stated complaint';
  const vitals = [
  temp !== null ? `T ${temp}°C` : '',
  c.hr ? `HR ${c.hr} bpm` : '',
  c.rr ? `RR ${c.rr} cpm` : '',
  c.bp ? `BP ${c.bp} mmHg` : ''].

  filter(Boolean).
  join(', ');
  const history = Object.keys(p.pastHistory);

  const summary = [
  `${who}, presents with ${complaintText}.`,
  vitals ? `Vitals: ${vitals}.` : 'Vital signs not yet recorded.',
  history.length ? `Past history of ${history.join(', ').toLowerCase()}.` : 'No significant past illness declared.',
  p.allergy.trim() ? `Allergic to ${p.allergy.trim().toLowerCase()}.` : 'No known allergies.'].
  join(' ');

  return { level, score, flags, summary, recommendation: RECOMMENDATIONS[level] };
}