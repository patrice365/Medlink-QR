import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeftIcon, ClipboardListIcon, HistoryIcon, LockIcon, SaveIcon, SendIcon, StethoscopeIcon, UserIcon, BoxIcon } from "lucide-react";
import { PatientRecord, PatientUpdate } from "../types/patient";
import { useRecords } from "../contexts/RecordsContext";
import { emptyClinical } from "../utils/patient";
import { RecordSidebar } from "../components/RecordSidebar";
import { TriageSummaryCard } from "../components/TriageSummaryCard";
import { ActionButton } from "../components/ActionButton";
import { QrModal } from "../components/QrModal";
import { Modal } from "../components/Modal";
import { Card } from "../components/ui/Card";
import { PersonalSection } from "../components/patient-form/PersonalSection";
import { SchoolContactSection } from "../components/patient-form/SchoolContactSection";
import { HealthHistorySection } from "../components/patient-form/HealthHistorySection";
import { LifestyleSection } from "../components/patient-form/LifestyleSection";
import { ClinicalVisitSection } from "../components/patient-form/ClinicalVisitSection";
import { VisitHistoryTab } from "../components/visit-history/VisitHistoryTab";
type Tab = 'visit' | 'personal' | 'history' | 'visits';
const TABS: {
  id: Tab;
  label: string;
  icon: typeof BoxIcon;
}[] = [{
  id: 'visit',
  label: 'Clinic Visit',
  icon: StethoscopeIcon
}, {
  id: 'personal',
  label: 'Personal & Contact',
  icon: UserIcon
}, {
  id: 'history',
  label: 'Health History',
  icon: ClipboardListIcon
}, {
  id: 'visits',
  label: 'Clinic Visit History',
  icon: HistoryIcon
}];
export function RecordDetail() {
  const {
    id = ''
  } = useParams();
  const navigate = useNavigate();
  const {
    getPatient,
    updatePatient,
    addVisit,
    visits,
    loading
  } = useRecords();
  const record = getPatient(id);
  const [draft, setDraft] = useState<PatientRecord | undefined>(record);
  const [tab, setTab] = useState<Tab>('visit');
  const [showQr, setShowQr] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setDraft(record), [record]);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(record), [draft, record]);
  const visitCount = useMemo(() => visits.filter((v) => v.patientId === record?.id).length, [visits, record?.id]);
  if (loading) {
    return <div className="grid min-h-[70vh] place-items-center p-6 text-ink-soft" role="status">
        Loading record…
      </div>;
  }
  if (!record || !draft) {
    return <div className="grid min-h-[70vh] place-items-center p-6 text-center">
        <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
          <h1 className="text-xl font-semibold text-brand-navy">Record not found</h1>
          <p className="mt-2 text-ink-soft">No patient matches “{id}”.</p>
          <div className="mt-6 flex justify-center">
            <ActionButton variant="secondary" icon={ArrowLeftIcon} onClick={() => navigate('/clinic')}>
              All records
            </ActionButton>
          </div>
        </div>
      </div>;
  }
  const update: PatientUpdate = (patch) => setDraft((d) => d ? {
    ...d,
    ...patch
  } : d);
  const save = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await updatePatient(draft);
      toast.success(tab === 'visit' ? 'Draft saved' : 'Changes saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save changes');
    } finally {
      setBusy(false);
    }
  };
  const requestSubmit = () => {
    const c = draft.clinical;
    if (!c.chiefComplaint.trim() || !c.physician.trim()) {
      toast.error('Add the chief complaint and examining physician before submitting');
      return;
    }
    setConfirmSubmit(true);
  };
  const submitVisit = async () => {
    if (busy) return;
    const c = draft.clinical;
    setBusy(true);
    try {
      await addVisit(draft.id, {
        ...c,
        dateTime: c.dateTime || format(new Date(), "yyyy-MM-dd'T'HH:mm")
      });
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : 'Could not submit the visit');
      return;
    }
    setConfirmSubmit(false);
    setTab('visits');
    toast.success('Visit submitted and saved to Clinic Visit History');
    try {
      // The visit is saved; now clear the draft notes on the patient record.
      await updatePatient({
        ...draft,
        clinical: emptyClinical()
      });
    } catch {
      toast.error('Visit saved, but the draft notes could not be cleared. Clear them and save.');
    } finally {
      setBusy(false);
    }
  };
  return <div className="mx-auto max-w-7xl px-5 py-8 pb-32 lg:px-10 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm">
        <button type="button" onClick={() => navigate('/clinic')} className="inline-flex h-11 items-center gap-1.5 font-medium text-brand-royal hover:text-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> Patient records
        </button>
        <span className="text-ink-faint">/</span>
        <span className="text-ink-soft">{record.id}</span>
      </nav>

      <div role="tablist" aria-label="Record sections" className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => {
        const active = tab === t.id;
        return <button key={t.id} role="tab" type="button" aria-selected={active} onClick={() => setTab(t.id)} className={`-mb-px flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${active ? 'border-brand-royal text-brand-royal' : 'border-transparent text-ink-soft hover:text-ink'}`}>
              <t.icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
              {t.id === 'visits' && visitCount > 0 && <span className={`rounded-full px-2 py-0.5 text-xs ${active ? 'bg-tint text-brand-royal' : 'bg-canvas text-ink-soft ring-1 ring-line'}`}>
                  {visitCount}
                </span>}
            </button>;
      })}
      </div>

      {tab === 'visits' ? <VisitHistoryTab patient={record} onStartVisit={() => setTab('visit')} /> : <div className="grid gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-24 xl:self-start">
            <RecordSidebar patient={record} onShowQr={() => setShowQr(true)} />
          </div>

          <div className="min-w-0">
            {tab === 'visit' && <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card eyebrow="Medical staff only" title="Clinic Visit">
                  <ClinicalVisitSection data={draft} update={update} />
                  <div className="mt-8 border-t border-line pt-6">
                    <div className="grid gap-3 text-[13px] text-ink-soft sm:grid-cols-2 sm:gap-6">
                      <p className="flex items-start gap-2">
                        <SaveIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-royal" aria-hidden="true" />
                        <span>
                          <strong className="font-semibold text-ink">Save draft</strong> keeps your notes so you can come back.
                          Nothing is added to the history yet.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-royal" aria-hidden="true" />
                        <span>
                          <strong className="font-semibold text-ink">Submit & lock</strong> finalizes the visit in Clinic Visit
                          History and clears the form.
                        </span>
                      </p>
                    </div>
                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <ActionButton variant="secondary" icon={SaveIcon} onClick={save} disabled={!dirty} loading={busy}>
                        Save draft
                      </ActionButton>
                      <ActionButton icon={SendIcon} onClick={requestSubmit}>
                        Submit & lock visit
                      </ActionButton>
                    </div>
                  </div>
                </Card>
                <div className="2xl:sticky 2xl:top-24 2xl:self-start">
                  <TriageSummaryCard patient={draft} live />
                </div>
              </div>}
            {tab === 'personal' && <div className="space-y-6">
                <Card eyebrow="Patient information" title="Student Information">
                  <PersonalSection data={draft} update={update} />
                </Card>
                <Card eyebrow="Patient information" title="Academic, Contact & Guardian">
                  <SchoolContactSection data={draft} update={update} />
                </Card>
              </div>}
            {tab === 'history' && <div className="space-y-6">
                <Card eyebrow="Medical background" title="Health History">
                  <HealthHistorySection data={draft} update={update} />
                </Card>
                <Card eyebrow="Psychosocial" title="Lifestyle & Obstetric History">
                  <LifestyleSection data={draft} update={update} />
                </Card>
              </div>}
          </div>
        </div>}

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 md:pl-20 lg:pl-64">
        <AnimatePresence>
          {dirty && tab !== 'visits' && tab !== 'visit' && <motion.div initial={{
          opacity: 0,
          y: 16
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: 16
        }} transition={{
          duration: 0.2,
          ease: [0.23, 1, 0.32, 1]
        }} className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-line bg-white py-2.5 pl-5 pr-2.5 shadow-pop">
              <span className="h-2 w-2 rounded-full bg-brand-gold" aria-hidden="true" />
              <span className="text-sm font-medium text-ink">Unsaved changes</span>
              <ActionButton variant="ghost" size="sm" onClick={() => setDraft(record)}>
                Discard
              </ActionButton>
              <ActionButton size="sm" icon={SaveIcon} onClick={save} loading={busy}>
                Save changes
              </ActionButton>
            </motion.div>}
        </AnimatePresence>
      </div>

      <Modal open={confirmSubmit} onClose={() => setConfirmSubmit(false)} title="Submit this clinic visit?" description="Once submitted, the visit is locked in Clinic Visit History. Only authorized personnel can amend it.">
        <dl className="space-y-3 rounded-xl bg-canvas p-4 text-sm">
          <div>
            <dt className="text-ink-soft">Chief complaint</dt>
            <dd className="font-medium text-ink">{draft.clinical.chiefComplaint}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Diagnosis</dt>
            <dd className="font-medium text-ink">{draft.clinical.diagnosis || 'Not recorded'}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Examining physician</dt>
            <dd className="font-medium text-ink">{draft.clinical.physician}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <ActionButton variant="outline" onClick={() => setConfirmSubmit(false)}>
            Keep editing
          </ActionButton>
          <ActionButton icon={LockIcon} onClick={submitVisit} loading={busy}>
            Submit & lock
          </ActionButton>
        </div>
      </Modal>

      <QrModal patient={record} open={showQr} onClose={() => setShowQr(false)} />
    </div>;
}