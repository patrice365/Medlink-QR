import React from 'react';
import type { TriageLevel } from '../utils/triage';

const styles: Record<TriageLevel, {pill: string;dot: string;}> = {
  Emergent: { pill: 'bg-danger-soft text-danger-strong', dot: 'bg-danger animate-pulse' },
  Urgent: { pill: 'bg-brand-gold-soft text-brand-gold-ink', dot: 'bg-brand-gold' },
  'Non-urgent': { pill: 'bg-success-soft text-success', dot: 'bg-success' },
  Pending: { pill: 'bg-canvas text-ink-soft ring-1 ring-line', dot: 'bg-ink-faint' }
};

const labels: Record<TriageLevel, string> = {
  Emergent: 'Emergent',
  Urgent: 'Urgent',
  'Non-urgent': 'Non-urgent',
  Pending: 'No visit yet'
};

export function TriageBadge({ level, large = false }: {level: TriageLevel;large?: boolean;}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ${styles[level].pill} ${
      large ? 'px-3 py-1 text-[13px]' : 'px-2.5 py-0.5 text-xs'}`
      }>
      
      <span className={`h-1.5 w-1.5 rounded-full ${styles[level].dot}`} aria-hidden="true" />
      {labels[level]}
    </span>);

}