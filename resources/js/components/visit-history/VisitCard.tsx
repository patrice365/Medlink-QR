import React from "react";
import { CalendarClockIcon, CalendarIcon, ClipboardListIcon, EyeIcon, PillIcon, StethoscopeIcon, BoxIcon } from "lucide-react";
import { VisitRecord } from "../../types/visit";
import { formatDay, formatTime, visitDate } from "../../utils/visit";
import { ActionButton } from "../ActionButton";
import { IconChip } from "../ui/IconChip";
import { MostRecentPill, VisitStatusBadge } from "./VisitStatusBadge";
import { PhysicianTag } from "./PhysicianTag";
interface VisitCardProps {
  visit: VisitRecord;
  mostRecent: boolean;
  onOpen: (visit: VisitRecord) => void;
}
function Detail({
  icon: Icon,
  label,
  value,
  wide = false





}: {icon: typeof BoxIcon;label: string;value: string;wide?: boolean;}) {
  return <div className={wide ? 'md:col-span-2' : ''}>
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        <Icon className="h-3.5 w-3.5 text-brand-royal" aria-hidden="true" />
        {label}
      </dt>
      <dd className={`mt-1 text-[15px] leading-relaxed ${value ? 'text-ink' : 'text-ink-soft'}`}>{value || 'Not recorded'}</dd>
    </div>;
}
export function VisitCard({
  visit,
  mostRecent,
  onOpen
}: VisitCardProps) {
  const c = visit.clinical;
  const date = visitDate(visit);
  return <article onClick={() => onOpen(visit)} className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-card transition-[border-color] duration-150 ease-out hover:border-brand-royal/50 sm:p-6 ${mostRecent ? 'border-brand-royal/60 ring-1 ring-brand-royal/15' : 'border-line'}`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconChip icon={CalendarIcon} />
          <div>
            <h3 className="text-base font-semibold text-brand-navy">{formatDay(date)}</h3>
            <p className="text-sm text-ink-soft">{formatTime(date)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {mostRecent && <MostRecentPill />}
          <VisitStatusBadge status={visit.status} />
        </div>
      </header>

      <div className="mt-4">
        <PhysicianTag name={c.physician} />
      </div>

      <dl className="mt-5 grid gap-5 md:grid-cols-2 md:gap-6">
        <Detail icon={StethoscopeIcon} label="Chief complaint" value={c.chiefComplaint} />
        <Detail icon={ClipboardListIcon} label="Diagnosis" value={c.diagnosis} />
        <Detail icon={PillIcon} label="Treatment / medication" value={c.treatment} wide />
      </dl>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        {c.followUpDate ? <span className="inline-flex items-center gap-2 text-sm text-ink">
            <CalendarClockIcon className="h-4 w-4 text-brand-royal" aria-hidden="true" />
            Follow-up <strong className="font-semibold">{formatDay(c.followUpDate)}</strong>
          </span> : <span className="text-sm text-ink-soft">No follow-up scheduled</span>}
        <ActionButton size="sm" variant="secondary" icon={EyeIcon} className="!h-11 !px-4" onClick={(e) => {
        e.stopPropagation();
        onOpen(visit);
      }}>
          View details
        </ActionButton>
      </footer>
    </article>;
}