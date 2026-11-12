import type { ClinicalRecord } from './patient';

export type VisitStatus = 'Completed' | 'Follow-up Required' | 'Archived';
export type VisitView = 'timeline' | 'table';

export interface VisitRecord {
  id: string;
  patientId: string;
  submittedAt: string;
  status: VisitStatus;
  clinical: ClinicalRecord;
  amendedAt?: string;
  amendedBy?: string;
}

export type VisitSeed = Omit<VisitRecord, 'clinical'> & {clinical: Partial<ClinicalRecord>;};

export interface VisitFilters {
  query: string;
  from: string;
  to: string;
  physician: string;
  status: VisitStatus | 'All';
}