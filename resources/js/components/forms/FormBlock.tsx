import React from 'react';

interface FormBlockProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormBlock({ title, description, children }: FormBlockProps) {
  return (
    <section className="space-y-5 border-t border-line pt-8 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-[17px] font-semibold leading-snug text-brand-royal">{title}</h3>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {children}
    </section>);

}