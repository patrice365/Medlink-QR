import React, { useId } from 'react';
import { CalendarIcon } from 'lucide-react';

interface DateRangeFieldProps {
  label: string;
  from: string;
  to: string;
  onChange: (range: {from: string;to: string;}) => void;
}

export function DateRangeField({ label, from, to, onChange }: DateRangeFieldProps) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id}>
      <span id={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </span>
      <div className="flex h-11 items-center gap-1.5 rounded-[10px] border border-line bg-white pl-3 pr-1.5 transition-[border-color,box-shadow] duration-150 focus-within:border-brand-royal focus-within:ring-4 focus-within:ring-brand-royal/15">
        <CalendarIcon className="h-4 w-4 shrink-0 text-brand-royal" aria-hidden="true" />
        <input
          type="date"
          aria-label="From date"
          value={from}
          max={to || undefined}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className="h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm text-ink focus:outline-none" />
        
        <span className="text-ink-faint" aria-hidden="true">
          –
        </span>
        <input
          type="date"
          aria-label="To date"
          value={to}
          min={from || undefined}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className="h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm text-ink focus:outline-none" />
        
      </div>
    </div>);

}