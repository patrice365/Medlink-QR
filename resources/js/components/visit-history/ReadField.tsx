import React from 'react';

interface ReadFieldProps {
  label: string;
  value: string;
  className?: string;
}

export function ReadField({ label, value, className = '' }: ReadFieldProps) {
  return (
    <div className={className}>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>
      <p
        className={`min-h-[44px] whitespace-pre-line rounded-[10px] bg-tint px-3.5 py-2.5 text-[15px] leading-relaxed ${
        value ? 'text-ink' : 'text-ink-soft'}`
        }>
        
        {value || '—'}
      </p>
    </div>);

}