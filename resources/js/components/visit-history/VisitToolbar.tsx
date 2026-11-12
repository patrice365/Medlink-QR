import React, { useState } from "react";
import { GitCommitVerticalIcon, SearchIcon, SlidersHorizontalIcon, Table2Icon, BoxIcon } from "lucide-react";
import { VisitFilters, VisitView } from "../../types/visit";
import { VisitFilterFields } from "./VisitFilterFields";
import { VisitFilterDrawer } from "./VisitFilterDrawer";
interface VisitToolbarProps {
  filters: VisitFilters;
  onChange: (patch: Partial<VisitFilters>) => void;
  onClear: () => void;
  activeFilterCount: number;
  physicians: string[];
  view: VisitView;
  onViewChange: (view: VisitView) => void;
  resultCount: number;
  total: number;
}
const VIEWS: {
  id: VisitView;
  label: string;
  icon: typeof BoxIcon;
}[] = [{
  id: 'timeline',
  label: 'Timeline',
  icon: GitCommitVerticalIcon
}, {
  id: 'table',
  label: 'Table',
  icon: Table2Icon
}];
export function VisitToolbar({
  filters,
  onChange,
  onClear,
  activeFilterCount,
  physicians,
  view,
  onViewChange,
  resultCount,
  total
}: VisitToolbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerFilterCount = activeFilterCount - (filters.query.trim() ? 1 : 0);
  return <section aria-label="Filter visits" className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-end gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_300px_190px_190px] xl:gap-4">
        <div className="min-w-0 flex-1">
          <label htmlFor="visit-search" className="mb-1.5 block text-sm font-medium text-ink">
            Search visits
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input id="visit-search" type="search" value={filters.query} onChange={(e) => onChange({
            query: e.target.value
          })} placeholder="Chief complaint, diagnosis, or notes" className="h-11 w-full rounded-[10px] border border-line bg-white pl-10 pr-3 text-[15px] text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] duration-150 focus:border-brand-royal focus:outline-none focus:ring-4 focus:ring-brand-royal/15" />
          </div>
        </div>

        <div className="hidden xl:contents">
          <VisitFilterFields filters={filters} onChange={onChange} physicians={physicians} />
        </div>

        <button type="button" onClick={() => setDrawerOpen(true)} className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-[10px] bg-secondary px-4 text-[15px] font-medium text-secondary-ink transition-colors duration-150 hover:bg-secondary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 xl:hidden">
          <SlidersHorizontalIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          Filters
          {drawerFilterCount > 0 && <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-royal px-1.5 text-[11px] font-semibold text-white">
              {drawerFilterCount}
            </span>}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-sm text-ink-soft" aria-live="polite">
            Showing <strong className="font-semibold text-ink">{resultCount}</strong> of {total} {total === 1 ? 'visit' : 'visits'}
          </p>
          {activeFilterCount > 0 && <button type="button" onClick={onClear} className="inline-flex h-11 items-center text-sm font-medium text-brand-royal underline-offset-4 hover:text-brand-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
              Clear filters
            </button>}
        </div>

        <div role="radiogroup" aria-label="View" className="flex rounded-full bg-canvas p-1 ring-1 ring-line">
          {VIEWS.map((v) => {
          const active = view === v.id;
          return <button key={v.id} type="button" role="radio" aria-checked={active} onClick={() => onViewChange(v.id)} className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${active ? 'bg-white text-brand-royal shadow-card ring-1 ring-line' : 'text-ink-soft hover:text-ink'}`}>
                <v.icon className="h-4 w-4" aria-hidden="true" />
                {v.label}
              </button>;
        })}
        </div>
      </div>

      <VisitFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} filters={filters} onChange={onChange} onClear={onClear} physicians={physicians} resultCount={resultCount} />
    </section>;
}