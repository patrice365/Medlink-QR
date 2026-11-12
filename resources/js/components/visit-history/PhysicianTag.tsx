import React from 'react';
import { physicianInitial } from '../../utils/visit';

export function PhysicianTag({ name, compact = false }: {name: string;compact?: boolean;}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-brand-navy font-semibold text-white ${compact ? 'h-7 w-7 text-xs' : 'h-8 w-8 text-sm'}`}
        aria-hidden="true">
        
        {physicianInitial(name)}
      </span>
      <span className="min-w-0">
        {!compact && <span className="block text-xs text-ink-soft">Examining physician</span>}
        <span className="block truncate text-sm font-medium text-ink">{name || 'Not recorded'}</span>
      </span>
    </span>);

}