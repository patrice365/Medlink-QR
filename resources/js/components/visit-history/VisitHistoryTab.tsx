import React, { useMemo, useState } from 'react';
import type { PatientRecord } from '../../types/patient';
import type { VisitRecord } from '../../types/visit';
import { useRecords } from '../../contexts/RecordsContext';
import { useVisitHistory } from '../../hooks/useVisitHistory';
import { VisitPatientHeader } from './VisitPatientHeader';
import { VisitToolbar } from './VisitToolbar';
import { VisitTimeline } from './VisitTimeline';
import { VisitTable } from './VisitTable';
import { VisitPagination } from './VisitPagination';
import { VisitEmptyState } from './VisitEmptyState';
import { VisitDetailPanel } from './VisitDetailPanel';

interface VisitHistoryTabProps {
  patient: PatientRecord;
  onStartVisit: () => void;
}

export function VisitHistoryTab({ patient, onStartVisit }: VisitHistoryTabProps) {
  const { visits, canEditVisits, updateVisit } = useRecords();
  const patientVisits = useMemo(() => visits.filter((v) => v.patientId === patient.id), [visits, patient.id]);
  const history = useVisitHistory(patientVisits);
  const [openId, setOpenId] = useState<string | null>(null);
  const openVisit = patientVisits.find((v) => v.id === openId) ?? null;
  const latest = patientVisits.find((v) => v.id === history.mostRecentId);

  const handleOpen = (v: VisitRecord) => setOpenId(v.id);

  return (
    <div className="space-y-6">
      <VisitPatientHeader patient={patient} latest={latest} totalVisits={patientVisits.length} />

      {patientVisits.length === 0 ?
      <VisitEmptyState variant="empty" onAction={onStartVisit} /> :

      <>
          <VisitToolbar
          filters={history.filters}
          onChange={history.updateFilters}
          onClear={history.clearFilters}
          activeFilterCount={history.activeFilterCount}
          physicians={history.physicians}
          view={history.view}
          onViewChange={history.setView}
          resultCount={history.filtered.length}
          total={history.total} />
        

          {history.filtered.length === 0 ?
        <VisitEmptyState variant="no-results" onAction={history.clearFilters} /> :

        <>
              {history.view === 'timeline' ?
          <VisitTimeline visits={history.paged} mostRecentId={history.mostRecentId} onOpen={handleOpen} /> :

          <VisitTable visits={history.paged} mostRecentId={history.mostRecentId} onOpen={handleOpen} />
          }
              <VisitPagination
            page={history.page}
            pageCount={history.pageCount}
            pageSize={history.pageSize}
            total={history.filtered.length}
            onPage={history.setPage}
            onPageSize={history.setPageSize} />
          
            </>
        }
        </>
      }

      <VisitDetailPanel
        visit={openVisit}
        patient={patient}
        canEdit={canEditVisits}
        onClose={() => setOpenId(null)}
        onSave={updateVisit} />
      
    </div>);

}