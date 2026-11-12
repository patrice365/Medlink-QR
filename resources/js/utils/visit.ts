import { format, parseISO } from 'date-fns';
import type { ClinicalRecord } from '../types/patient';
import type { VisitFilters, VisitRecord, VisitSeed, VisitStatus } from '../types/visit';
import { emptyClinical } from './patient';

export const EMPTY_VISIT_FILTERS: VisitFilters = { query: '', from: '', to: '', physician: '', status: 'All' };
export const VISIT_STATUSES: VisitStatus[] = ['Completed', 'Follow-up Required', 'Archived'];

export function hydrateVisit(seed: VisitSeed | VisitRecord): VisitRecord {
  return { ...seed, clinical: { ...emptyClinical(), ...seed.clinical } };
}

export function visitDate(v: VisitRecord): string {
  return v.clinical.dateTime || v.submittedAt;
}

export function sortVisitsNewest(visits: VisitRecord[]): VisitRecord[] {
  return [...visits].sort((a, b) => parseISO(visitDate(b)).getTime() - parseISO(visitDate(a)).getTime());
}

export function statusForSubmission(c: ClinicalRecord): VisitStatus {
  return c.followUpDate ? 'Follow-up Required' : 'Completed';
}

export function formatDay(iso: string): string {
  return iso ? format(parseISO(iso), 'MMM d, yyyy') : '—';
}

export function formatTime(iso: string): string {
  return iso ? format(parseISO(iso), 'h:mm a') : '';
}

export function formatDayTime(iso: string): string {
  return iso ? format(parseISO(iso), "MMM d, yyyy 'at' h:mm a") : '—';
}

export function physicianInitial(name: string): string {
  const cleaned = name.replace(/^Dr\.?\s*/i, '').trim();
  return (cleaned[0] ?? '?').toUpperCase();
}

export function matchesFilters(v: VisitRecord, f: VisitFilters): boolean {
  const c = v.clinical;
  const q = f.query.trim().toLowerCase();
  if (
  q &&
  ![c.chiefComplaint, c.diagnosis, c.assessment, c.treatment, c.plan, c.presentIllness, c.otherRemarks, c.midas].some((t) =>
  t.toLowerCase().includes(q)
  ))
  {
    return false;
  }
  const day = visitDate(v).slice(0, 10);
  if (f.from && day < f.from) return false;
  if (f.to && day > f.to) return false;
  if (f.physician && c.physician !== f.physician) return false;
  if (f.status !== 'All' && v.status !== f.status) return false;
  return true;
}

export function newVisitId(): string {
  return `VS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}