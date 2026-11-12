import React from "react";
import { ArchiveIcon, CalendarClockIcon, CircleCheckIcon, BoxIcon } from "lucide-react";
import { VisitStatus } from "../../types/visit";
const CONFIG: Record<VisitStatus, {
  icon: typeof BoxIcon;
  className: string;
}> = {
  Completed: {
    icon: CircleCheckIcon,
    className: 'bg-success-soft text-success-ink'
  },
  'Follow-up Required': {
    icon: CalendarClockIcon,
    className: 'bg-brand-gold-soft text-brand-gold-ink'
  },
  Archived: {
    icon: ArchiveIcon,
    className: 'bg-archive-soft text-archive-ink'
  }
};
export function VisitStatusBadge({
  status


}: {status: VisitStatus;}) {
  const {
    icon: Icon,
    className
  } = CONFIG[status];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status}
    </span>;
}
export function MostRecentPill() {
  return <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-brand-gold px-2.5 py-1 text-xs font-semibold text-brand-navy">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-navy" aria-hidden="true" />
      Most recent
    </span>;
}