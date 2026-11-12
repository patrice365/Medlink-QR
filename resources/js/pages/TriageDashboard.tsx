import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleCheckIcon, ClockIcon, FolderOpenIcon, HourglassIcon, SirenIcon, BoxIcon } from "lucide-react";
import { useRecords } from "../contexts/RecordsContext";
import { assessTriage, TriageLevel } from "../utils/triage";
import { computeAge, fullName } from "../utils/patient";
import { PatientAvatar } from "../components/PatientAvatar";
import { TriageBadge } from "../components/TriageBadge";
import { TriageSummaryCard } from "../components/TriageSummaryCard";
import { ActionButton } from "../components/ActionButton";
import { PageHeader } from "../components/ui/PageHeader";
const LEVEL_BAR: Record<TriageLevel, string> = {
  Emergent: 'bg-danger',
  Urgent: 'bg-brand-gold',
  'Non-urgent': 'bg-success',
  Pending: 'bg-line'
};
const STATS: {
  level: TriageLevel;
  label: string;
  caption: string;
  icon: typeof BoxIcon;
}[] = [{
  level: 'Urgent',
  label: 'Urgent',
  caption: 'See within 30 min',
  icon: ClockIcon
}, {
  level: 'Non-urgent',
  label: 'Non-urgent',
  caption: 'Routine care',
  icon: CircleCheckIcon
}, {
  level: 'Pending',
  label: 'No visit yet',
  caption: 'Registered only',
  icon: HourglassIcon
}];
export function TriageDashboard() {
  const navigate = useNavigate();
  const {
    patients
  } = useRecords();
  const assessed = useMemo(() => patients.map((p) => ({
    p,
    t: assessTriage(p)
  })), [patients]);
  const queue = useMemo(() => assessed.filter((x) => x.t.level !== 'Pending').sort((a, b) => b.t.score - a.t.score), [assessed]);
  const [selectedId, setSelectedId] = useState<string | undefined>(queue[0]?.p.id);
  const selected = queue.find((x) => x.p.id === selectedId) ?? queue[0];
  const count = (level: TriageLevel) => assessed.filter((x) => x.t.level === level).length;
  const emergent = count('Emergent');
  return <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-10">
      <PageHeader eyebrow="Clinical decision support" title="AI-assisted triage" description="Patients with a recorded visit, highest priority first." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className={`rounded-2xl border bg-white p-6 shadow-card ${emergent ? 'border-danger/40' : 'border-line'}`}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-brand-navy">Emergent</p>
            <span className={`grid h-9 w-9 place-items-center rounded-lg ${emergent ? 'bg-danger-soft text-danger' : 'bg-tint text-brand-royal'}`}>
              <SirenIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
          </div>
          <p className={`mt-3 text-5xl font-semibold tracking-tight ${emergent ? 'text-danger' : 'text-brand-navy'}`}>{emergent}</p>
          <p className="mt-1 text-sm text-ink-soft">Attend immediately</p>
        </div>
        {STATS.map((s) => <div key={s.level} className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-brand-navy">{s.label}</p>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-tint text-brand-royal">
                <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-brand-navy">{count(s.level)}</p>
            <p className="mt-1 text-sm text-ink-soft">{s.caption}</p>
          </div>)}
      </div>

      {queue.length === 0 ? <div className="mt-8 rounded-2xl border border-line bg-white p-12 text-center shadow-card">
          <p className="font-semibold text-brand-navy">No visits recorded yet</p>
          <p className="mt-1 text-sm text-ink-soft">Open a patient record and add a chief complaint and vital signs.</p>
        </div> : <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section aria-labelledby="queue-title" className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="queue-title" className="text-lg font-semibold text-brand-navy">Triage queue</h2>
              <span className="text-sm text-ink-soft">{queue.length} patients</span>
            </div>
            <ul className="divide-y divide-line">
              {queue.map(({
            p,
            t
          }) => {
            const active = selected?.p.id === p.id;
            return <li key={p.id}>
                    <button type="button" onClick={() => setSelectedId(p.id)} aria-current={active ? 'true' : undefined} className={`flex w-full items-center gap-4 py-4 pr-6 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-royal/20 ${active ? 'bg-tint' : 'hover:bg-tint/40'}`}>
                      <span className={`h-12 w-1 shrink-0 rounded-r-full ${LEVEL_BAR[t.level]}`} aria-hidden="true" />
                      <PatientAvatar patient={p} />
                      <span className="min-w-0 flex-1">
                        <span className={`block font-medium ${active ? 'text-brand-royal' : 'text-brand-navy'}`}>{fullName(p)}</span>
                        <span className="block truncate text-sm text-ink">{p.clinical.chiefComplaint || 'No complaint recorded'}</span>
                        <span className="mt-1 block text-xs text-ink-soft">
                          {computeAge(p.dateOfBirth)} yrs · {p.program} · T {p.clinical.temp || '—'}°C · HR {p.clinical.hr || '—'} · RR{' '}
                          {p.clinical.rr || '—'}
                        </span>
                      </span>
                      <TriageBadge level={t.level} />
                    </button>
                  </li>;
          })}
            </ul>
          </section>

          {selected && <div className="lg:sticky lg:top-24 lg:self-start">
              <TriageSummaryCard patient={selected.p} actions={<ActionButton icon={FolderOpenIcon} fullWidth onClick={() => navigate(`/clinic/records/${selected.p.id}`)}>
                    Open patient record
                  </ActionButton>} />
            </div>}
        </div>}

    </div>;
}