import React from 'react';
import { CheckIcon } from 'lucide-react';

interface CheckChipProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckChip({ label, checked, onToggle }: CheckChipProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={`flex min-h-[44px] w-full items-center gap-3 rounded-[10px] border px-3.5 py-2 text-left text-[15px] text-ink transition-[background-color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${
      checked ? 'border-brand-royal bg-tint' : 'border-line bg-white hover:bg-canvas'}`
      }>
      
      <span
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border ${
        checked ? 'border-brand-royal bg-brand-royal text-white' : 'border-ink-faint bg-white'}`
        }
        aria-hidden="true">
        
        {checked && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="min-w-0">{label}</span>
    </button>);

}