import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  eyebrow?: string;
  actions?: React.ReactNode;
  padded?: boolean;
  className?: string;
}

export function Card({ children, title, eyebrow, actions, padded = true, className = '' }: CardProps) {
  return (
    <section className={`rounded-2xl border border-line bg-white shadow-card ${padded ? 'p-6 sm:p-8' : ''} ${className}`}>
      {(title || eyebrow || actions) &&
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {eyebrow && <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">{eyebrow}</p>}
            {title && <h2 className="text-xl font-semibold text-brand-navy">{title}</h2>}
          </div>
          {actions}
        </header>
      }
      {children}
    </section>);

}