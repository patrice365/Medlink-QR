import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { LockIcon, PencilIcon, PrinterIcon, SaveIcon, XIcon } from 'lucide-react';
import type { PatientRecord } from '../../types/patient';
import type { VisitRecord, VisitStatus } from '../../types/visit';
import { computeBmi, fullName } from '../../utils/patient';
import { VISIT_STATUSES, formatDay, formatDayTime, visitDate } from '../../utils/visit';
import { ActionButton } from '../ActionButton';
import { TextField } from '../forms/TextField';
import { SelectField } from '../forms/SelectField';
import { ReadField } from './ReadField';
import { VisitStatusBadge } from './VisitStatusBadge';

interface VisitDetailPanelProps {
  visit: VisitRecord | null;
  patient: PatientRecord;
  canEdit: boolean;
  onClose: () => void;
  onSave: (visit: VisitRecord) => Promise<void>;
}

const EASE = [0.23, 1, 0.32, 1] as const;

function Section({ title, children }: {title: string;children: React.ReactNode;}) {
  return (
    <section className="space-y-4 border-t border-line pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-base font-semibold text-brand-royal">{title}</h3>
      {children}
    </section>);

}

export function VisitDetailPanel({ visit, patient, canEdit, onClose, onSave }: VisitDetailPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<VisitRecord | null>(visit);

  useEffect(() => {
    setDraft(visit);
    setEditing(false);
  }, [visit]);

  useEffect(() => {
    if (!visit) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [visit, onClose]);

  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    try {
      // The server records who amended the visit and when.
      await onSave(draft);
      setEditing(false);
      toast.success('Visit record amended');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save the amendment');
    } finally {
      setSaving(false);
    }
  };

  const setClinical = (patch: Partial<VisitRecord['clinical']>) =>
  setDraft((d) => d ? { ...d, clinical: { ...d.clinical, ...patch } } : d);

  const v = draft;
  const c = v?.clinical;
  const exam = c ? Object.entries(c.physicalExam).filter(([, value]) => value.trim()) : [];

  return (
    <AnimatePresence>
      {v && c &&
      <>
          <motion.div
          className="fixed inset-0 z-50 bg-brand-navy/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={onClose} />
        
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="visit-detail-title"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.26, ease: EASE }}
          className="print-area fixed inset-0 z-50 flex flex-col bg-white lg:left-auto lg:w-[560px] lg:border-l lg:border-line lg:shadow-pop">
          
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Clinic visit record · {v.id}</p>
                <h2 id="visit-detail-title" className="mt-1 text-xl font-semibold text-brand-navy">
                  {formatDay(visitDate(v))}
                </h2>
                <p className="mt-0.5 text-sm text-ink-soft">{fullName(patient)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <VisitStatusBadge status={v.status} />
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-tint px-2.5 py-1 text-xs font-medium text-brand-navy">
                    <LockIcon className="h-3.5 w-3.5 text-brand-royal" aria-hidden="true" />
                    {editing ? 'Amending' : 'Read-only'}
                  </span>
                </div>
              </div>
              <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close visit details"
              className="no-print grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft transition-colors duration-150 hover:bg-tint hover:text-brand-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
              
                <XIcon className="h-5 w-5" />
              </button>
            </header>

            <div className="print-scroll flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <Section title="Visit">
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <ReadField label="Date & time" value={formatDayTime(visitDate(v))} />
                  <ReadField label="Examining physician" value={c.physician} />
                </div>
              </Section>

              <Section title="Vital signs">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <ReadField label="Weight" value={c.weight && `${c.weight} kg`} />
                  <ReadField label="Height" value={c.height && `${c.height} cm`} />
                  <ReadField label="BMI" value={computeBmi(c.weight, c.height)} />
                  <ReadField label="Blood pressure" value={c.bp && `${c.bp} mmHg`} />
                  <ReadField label="Heart rate" value={c.hr && `${c.hr} bpm`} />
                  <ReadField label="Resp. rate" value={c.rr && `${c.rr} cpm`} />
                  <ReadField label="Temperature" value={c.temp && `${c.temp} °C`} />
                </div>
              </Section>

              <Section title="Complaint">
                <ReadField label="Chief complaint" value={c.chiefComplaint} />
                <ReadField label="History of present illness" value={c.presentIllness} />
              </Section>

              <Section title="Physical examination">
                {exam.length ?
              <div className="grid gap-4 sm:grid-cols-2">
                    {exam.map(([area, value]) =>
                <ReadField key={area} label={area} value={value} />
                )}
                  </div> :

              <p className="text-sm text-ink-soft">No examination findings recorded.</p>
              }
              </Section>

              <Section title="Assessment">
                <ReadField label="Assessment" value={c.assessment} />
              </Section>

              <Section title="Diagnosis">
                {editing ?
              <TextField label="Diagnosis" value={c.diagnosis} onChange={(diagnosis) => setClinical({ diagnosis })} /> :

              <ReadField label="Diagnosis" value={c.diagnosis} />
              }
              </Section>

              <Section title="Treatment">
                {editing ?
              <>
                    <TextField label="Treatment / medication" multiline rows={2} value={c.treatment} onChange={(treatment) => setClinical({ treatment })} />
                    <TextField label="Plan / management" multiline rows={2} value={c.plan} onChange={(plan) => setClinical({ plan })} />
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                      <TextField label="Follow-up date" type="date" value={c.followUpDate} onChange={(followUpDate) => setClinical({ followUpDate })} />
                      <SelectField
                    label="Status"
                    value={v.status}
                    onChange={(status) => setDraft((d) => d ? { ...d, status: status as VisitStatus } : d)}
                    options={VISIT_STATUSES.map((s) => ({ value: s, label: s }))} />
                  
                    </div>
                  </> :

              <>
                    <ReadField label="Treatment / medication" value={c.treatment} />
                    <ReadField label="Plan / management" value={c.plan} />
                    <ReadField label="Follow-up date" value={c.followUpDate ? formatDay(c.followUpDate) : ''} />
                  </>
              }
              </Section>

              <Section title="Notes">
                <ReadField label="M.I.D.A.S." value={c.midas} />
                {editing ?
              <TextField label="Other remarks" multiline rows={3} value={c.otherRemarks} onChange={(otherRemarks) => setClinical({ otherRemarks })} /> :

              <ReadField label="Other remarks" value={c.otherRemarks} />
              }
              </Section>
            </div>

            <footer className="border-t border-line bg-canvas px-6 py-4">
              <p className="flex items-start gap-2 text-[13px] text-ink-soft">
                <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-royal" aria-hidden="true" />
                <span>
                  Submitted on <strong className="font-semibold text-ink">{formatDayTime(v.submittedAt)}</strong> by{' '}
                  <strong className="font-semibold text-ink">{c.physician || 'clinic staff'}</strong>. Locked after submission.
                  {v.amendedAt && ` Amended ${formatDayTime(v.amendedAt)} by ${v.amendedBy}.`}
                </span>
              </p>
              <div className="no-print mt-4 flex flex-wrap justify-end gap-3">
                {editing ?
              <>
                    <ActionButton
                  variant="outline"
                  onClick={() => {
                    setDraft(visit);
                    setEditing(false);
                  }}>
                  
                      Cancel
                    </ActionButton>
                    <ActionButton icon={SaveIcon} onClick={save} loading={saving}>
                      Save amendment
                    </ActionButton>
                  </> :

              <>
                    <ActionButton variant="secondary" icon={PrinterIcon} onClick={() => window.print()}>
                      Print
                    </ActionButton>
                    {canEdit &&
                <ActionButton variant="outline" icon={PencilIcon} onClick={() => setEditing(true)}>
                        Edit
                      </ActionButton>
                }
                    <ActionButton onClick={onClose}>Close</ActionButton>
                  </>
              }
              </div>
            </footer>
          </motion.aside>
        </>
      }
    </AnimatePresence>);

}