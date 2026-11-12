import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import type { VisitRecord } from '../../types/visit';
import { formatDay, formatTime, visitDate } from '../../utils/visit';
import { MostRecentPill, VisitStatusBadge } from './VisitStatusBadge';
import { PhysicianTag } from './PhysicianTag';

interface VisitTableProps {
  visits: VisitRecord[];
  mostRecentId?: string;
  onOpen: (visit: VisitRecord) => void;
}

export function VisitTable({ visits, mostRecentId, onOpen }: VisitTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="max-h-[640px] overflow-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-line bg-canvas text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
            <tr>
              <th scope="col" className="px-5 py-3">
                <span className="text-brand-royal">Date & time ↓</span>
              </th>
              <th scope="col" className="px-5 py-3">Physician</th>
              <th scope="col" className="px-5 py-3">Chief complaint</th>
              <th scope="col" className="px-5 py-3">Diagnosis</th>
              <th scope="col" className="px-5 py-3">Follow-up</th>
              <th scope="col" className="px-5 py-3">Status</th>
              <th scope="col" className="px-5 py-3">
                <span className="sr-only">View details</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visits.map((v) => {
              const date = visitDate(v);
              const recent = v.id === mostRecentId;
              return (
                <tr
                  key={v.id}
                  onClick={() => onOpen(v)}
                  className={`cursor-pointer transition-colors duration-150 hover:bg-tint/50 ${recent ? 'bg-tint/30' : ''}`}>
                  
                  <td className="px-5 py-4 align-top">
                    <p className="font-medium text-brand-navy">{formatDay(date)}</p>
                    <p className="text-xs text-ink-soft">{formatTime(date)}</p>
                    {recent &&
                    <div className="mt-1.5">
                        <MostRecentPill />
                      </div>
                    }
                  </td>
                  <td className="px-5 py-4 align-top">
                    <PhysicianTag name={v.clinical.physician} compact />
                  </td>
                  <td className="max-w-[220px] px-5 py-4 align-top text-ink">{v.clinical.chiefComplaint || '—'}</td>
                  <td className="max-w-[220px] px-5 py-4 align-top text-ink">{v.clinical.diagnosis || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 align-top text-ink">
                    {v.clinical.followUpDate ? formatDay(v.clinical.followUpDate) : <span className="text-ink-soft">—</span>}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <VisitStatusBadge status={v.status} />
                  </td>
                  <td className="px-5 py-4 text-right align-top">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(v);
                      }}
                      aria-label={`View details for visit on ${formatDay(date)}`}
                      className="grid h-11 w-11 place-items-center rounded-full text-brand-royal transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
                      
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

}