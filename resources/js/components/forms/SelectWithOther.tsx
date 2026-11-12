import React, { useId, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { capitalizeWords } from '../../utils/text';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectWithOtherProps {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  otherLabel?: string;
  otherPlaceholder?: string;
  className?: string;
}

export const OTHER_VALUE = '__other__';

/** A dropdown whose last option, "Other", reveals a text box for a custom answer. */
export function SelectWithOther({
  label,
  value,
  options,
  onChange,
  required,
  error,
  placeholder = 'Select…',
  otherLabel = 'Other (please specify)',
  otherPlaceholder = 'Please specify',
  className = ''
}: SelectWithOtherProps) {
  const id = useId();
  const otherId = `${id}-other`;
  const msgId = `${id}-msg`;
  const isKnown = options.some((o) => o.value === value);
  const [otherMode, setOtherMode] = useState(value !== '' && !isKnown);
  const selectValue = otherMode ? OTHER_VALUE : isKnown ? value : '';

  const handleSelect = (next: string) => {
    if (next === OTHER_VALUE) {
      setOtherMode(true);
      onChange('');
    } else {
      setOtherMode(false);
      onChange(next);
    }
  };

  const border = error ? 'border-danger focus:ring-danger/15' : 'border-line focus:border-brand-royal focus:ring-brand-royal/15';

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={selectValue}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? msgId : undefined}
          onChange={(e) => handleSelect(e.target.value)}
          className={`h-11 w-full cursor-pointer appearance-none rounded-[10px] border bg-white pl-3.5 pr-10 text-[15px] transition-[border-color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-4 ${border} ${
          selectValue ? 'text-ink' : 'text-ink-faint'}`
          }>
          
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) =>
          <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          )}
          <option value={OTHER_VALUE} className="text-ink">
            {otherLabel}
          </option>
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
      </div>
      {otherMode &&
      <input
        id={otherId}
        aria-label={`${label}: please specify`}
        autoFocus
        value={value}
        placeholder={otherPlaceholder}
        onChange={(e) => onChange(capitalizeWords(e.target.value))}
        className={`mt-2 h-11 w-full rounded-[10px] border bg-white px-3.5 text-[15px] text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-4 ${border}`} />

      }
      {error &&
      <p id={msgId} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      }
    </div>);

}