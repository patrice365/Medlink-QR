import React, { useId } from 'react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  readOnly?: boolean;
  suffix?: string;
  className?: string;
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  hint,
  error,
  multiline,
  rows = 3,
  inputMode,
  autoComplete,
  readOnly,
  suffix,
  className = ''
}: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-msg`;
  const base = `w-full rounded-[10px] border px-3.5 text-[15px] text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-4 ${
  error ? 'border-danger focus:ring-danger/15' : 'border-line focus:border-brand-royal focus:ring-brand-royal/15'} ${
  readOnly ? 'cursor-default bg-tint text-ink' : 'bg-white'} ${suffix ? 'pr-16' : ''}`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-ink">
        <span>
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </span>
        {hint && <span className="text-[13px] font-normal text-ink-soft">{hint}</span>}
      </label>
      <div className="relative">
        {multiline ?
        <textarea
          id={id}
          value={value}
          rows={rows}
          placeholder={placeholder}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? messageId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} resize-y py-2.5 leading-relaxed`} /> :


        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? messageId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} h-11`} />

        }
        {suffix &&
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-ink-soft">{suffix}</span>
        }
      </div>
      {error &&
      <p id={messageId} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      }
    </div>);

}