import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  inverted?: boolean;
  className?: string;
}

export function Eyebrow({ children, inverted = false, className = '' }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] ${
        inverted ? 'text-white/70' : 'text-ink-soft'}`
        }>
        
        {children}
      </span>
      <span className={`h-px flex-1 ${inverted ? 'bg-white/20' : 'bg-line'}`} aria-hidden="true" />
    </div>);

}