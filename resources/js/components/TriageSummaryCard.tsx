import React, { useMemo } from 'react';
import { SparklesIcon } from 'lucide-react';
import type { PatientRecord } from '../types/patient';
import { assessTriage } from '../utils/triage';
import { TriageBadge } from './TriageBadge';

interface TriageSummaryCardProps {
  patient: PatientRecord;
  live?: boolean;
  actions?: React.ReactNode;
}

export function TriageSummaryCard({ patient, live = false, actions }: TriageSummaryCardProps) {
  const result = useMemo(() => assessTriage(patient), [patient]);

  return (
    <section aria-label="AI-assisted triage summary" className="rounded-2xl border border-line bg-white shadow-card">
      <header className="flex items-center justify-between gap-3 border-b border-line px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-tint text-brand-royal">
            <SparklesIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">AI-assisted</p>
            <h2 className="text-lg font-semibold leading-tight text-brand-navy">Triage summary</h2>
          </div>
        </div>
        <TriageBadge level={result.level} large />
      </header>

      <div className="space-y-6 p-6">
        <p className="text-[15px] leading-relaxed text-ink">{result.summary}</p>

        {result.flags.length > 0 &&
        <div>
            <h3 className="text-sm font-semibold text-brand-royal">What shaped this priority</h3>
            <ul className="mt-3 space-y-2.5">
              {result.flags.map((flag) =>
            <li key={flag.label} className="flex gap-2.5 text-sm">
                  <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${flag.tone === 'critical' ? 'bg-danger' : 'bg-brand-gold'}`}
                aria-hidden="true" />
              
                  <span>
                    <span className="font-medium text-ink">{flag.label}</span>
                    <span className="text-ink-soft"> — {flag.detail}</span>
                  </span>
                </li>
            )}
            </ul>
          </div>
        }

        {result.recommendation &&
        <div className="rounded-xl bg-tint p-4">
            <h3 className="text-sm font-semibold text-brand-navy">Suggested next step</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink">{result.recommendation}</p>
          </div>
        }

        {actions}

        <p className="border-t border-line pt-4 text-[13px] text-ink-soft">
          Generated from recorded data{live ? ', updates as you type' : ''}. Always confirm with clinical judgment.
        </p>
      </div>
    </section>);

}