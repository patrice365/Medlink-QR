import React, { useId } from 'react';
import { CheckIcon } from 'lucide-react';

interface ChoiceGroupProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T | '';
  onChange: (value: T) => void;
  required?: boolean;
  error?: string;
}

export function ChoiceGroup<T extends string>({ label, options, value, onChange, required, error }: ChoiceGroupProps<T>) {
  const id = useId();
  return (
    <div role="radiogroup" aria-labelledby={id}>
      <span id={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-[10px] border px-4 text-[15px] transition-[background-color,border-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${
              active ?
              'border-brand-royal bg-tint font-medium text-brand-royal' :
              `bg-white text-ink hover:bg-canvas ${error ? 'border-danger' : 'border-line'}`}`
              }>
              
              {active && <CheckIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />}
              {option}
            </button>);

        })}
      </div>
      {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>);

}