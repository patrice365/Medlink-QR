import React from "react";
import { BoxIcon } from "lucide-react";
interface IconChipProps {
  icon: typeof BoxIcon;
  size?: 'sm' | 'md';
  className?: string;
}
export function IconChip({
  icon: Icon,
  size = 'md',
  className = ''
}: IconChipProps) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const glyph = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';
  return <span className={`grid shrink-0 place-items-center rounded-full bg-tint text-brand-royal ${box} ${className}`} aria-hidden="true">
      <Icon className={glyph} strokeWidth={1.75} />
    </span>;
}