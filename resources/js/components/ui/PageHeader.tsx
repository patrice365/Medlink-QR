import React from 'react';
import { Eyebrow } from './Eyebrow';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-brand-navy">{title}</h1>
          {description && <p className="mt-1 text-[15px] text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>);

}