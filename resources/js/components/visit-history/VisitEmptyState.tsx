import React from 'react';
import { ClipboardListIcon, SearchXIcon, StethoscopeIcon } from 'lucide-react';
import { ActionButton } from '../ActionButton';

interface VisitEmptyStateProps {
  variant: 'empty' | 'no-results';
  onAction: () => void;
}

export function VisitEmptyState({ variant, onAction }: VisitEmptyStateProps) {
  const empty = variant === 'empty';
  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-white px-6 py-16 text-center shadow-card">
      <div className="relative">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-tint text-brand-royal">
          {empty ?
          <ClipboardListIcon className="h-10 w-10" strokeWidth={1.5} aria-hidden="true" /> :

          <SearchXIcon className="h-10 w-10" strokeWidth={1.5} aria-hidden="true" />
          }
        </span>
        {empty &&
        <span className="absolute -bottom-1 -right-1 grid h-10 w-10 place-items-center rounded-full border-4 border-white bg-brand-gold-soft text-brand-gold-ink">
            <StethoscopeIcon className="h-4 w-4" aria-hidden="true" />
          </span>
        }
      </div>
      <h3 className="mt-6 text-xl font-semibold text-brand-navy">{empty ? 'No clinic visits yet' : 'No visits match your filters'}</h3>
      <p className="mt-2 max-w-sm text-[15px] text-ink-soft">
        {empty ?
        'When a physician submits a completed clinic visit, it will be saved here automatically.' :
        'Try a different search term, widen the date range, or clear the filters.'}
      </p>
      <div className="mt-6">
        <ActionButton variant={empty ? 'primary' : 'secondary'} icon={empty ? StethoscopeIcon : undefined} onClick={onAction}>
          {empty ? 'Start a clinic visit' : 'Clear filters'}
        </ActionButton>
      </div>
    </div>);

}