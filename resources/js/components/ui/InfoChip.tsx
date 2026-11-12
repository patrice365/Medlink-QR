import React from "react";
import { BoxIcon } from "lucide-react";
interface InfoChipProps {
  icon?: typeof BoxIcon;
  children: React.ReactNode;
  tone?: 'blue' | 'gold';
}
export function InfoChip({
  icon: Icon,
  children,
  tone = 'blue'
}: InfoChipProps) {
  const toneClass = tone === 'gold' ? 'bg-brand-gold-soft text-brand-gold-ink' : 'bg-tint text-brand-navy';
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium ${toneClass}`}>
      {Icon && <Icon className={`h-3.5 w-3.5 ${tone === 'gold' ? 'text-brand-gold-ink' : 'text-brand-royal'}`} aria-hidden="true" />}
      {children}
    </span>;
}