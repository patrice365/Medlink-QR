import React from 'react';
import { GraduationCapIcon, HashIcon, HeartPulseIcon, TriangleAlertIcon, UserIcon } from 'lucide-react';
import type { PatientRecord } from '../../types/patient';
import type { VisitRecord } from '../../types/visit';
import { computeAge, fullName } from '../../utils/patient';
import { formatDay, visitDate } from '../../utils/visit';
import { PatientAvatar } from '../PatientAvatar';
import { InfoChip } from '../ui/InfoChip';

interface VisitPatientHeaderProps {
  patient: PatientRecord;
  latest?: VisitRecord;
  totalVisits: number;
}

export function VisitPatientHeader({ patient, latest, totalVisits }: VisitPatientHeaderProps) {
  const age = computeAge(patient.dateOfBirth);
  const conditions = Object.keys(patient.pastHistory);

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <PatientAvatar patient={{ ...patient, photo: '' }} size="md" />
          <div className="min-w-0">
            <h2 className="text-xl font-semibold leading-tight text-brand-navy">{fullName(patient)}</h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <InfoChip icon={HashIcon}>Student No. {patient.studentNo || '—'}</InfoChip>
              <InfoChip icon={UserIcon}>
                {age ?? '—'} yrs · {patient.sex || '—'}
              </InfoChip>
              <InfoChip icon={GraduationCapIcon}>{patient.program || '—'}</InfoChip>
            </div>
            {(patient.allergy || conditions.length > 0) &&
            <ul aria-label="Key alerts" className="mt-3 flex flex-wrap gap-2">
                {patient.allergy &&
              <li className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-3 py-1 text-[13px] font-medium text-danger-strong">
                    <TriangleAlertIcon className="h-3.5 w-3.5" aria-hidden="true" /> Allergy: {patient.allergy}
                  </li>
              }
                {conditions.map((c) =>
              <li
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-soft px-3 py-1 text-[13px] font-medium text-brand-gold-ink">
                
                    <HeartPulseIcon className="h-3.5 w-3.5" aria-hidden="true" /> {c}
                  </li>
              )}
              </ul>
            }
          </div>
        </div>

        <dl className="grid shrink-0 grid-cols-2 gap-6 border-t border-line pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Total visits</dt>
            <dd className="mt-1 text-2xl font-semibold text-brand-navy">{totalVisits}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Last visit</dt>
            <dd className="mt-1 text-[15px] font-medium text-ink">{latest ? formatDay(visitDate(latest)) : '—'}</dd>
          </div>
        </dl>
      </div>
    </section>);

}