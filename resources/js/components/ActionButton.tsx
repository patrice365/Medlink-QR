import React from "react";
import { Loader2Icon, BoxIcon } from "lucide-react";
type Variant = 'primary' | 'secondary' | 'navy' | 'outline' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: typeof BoxIcon;
  fullWidth?: boolean;
  loading?: boolean;
}
const variantClass: Record<Variant, string> = {
  primary: 'bg-brand-royal text-white hover:bg-brand-hover',
  secondary: 'bg-secondary text-secondary-ink hover:bg-secondary-hover',
  navy: 'bg-brand-navy text-white hover:bg-brand-hover',
  outline: 'border border-line bg-white text-ink hover:bg-canvas',
  danger: 'bg-danger text-white hover:bg-danger-strong',
  ghost: 'bg-transparent text-ink-soft hover:bg-tint hover:text-brand-royal'
};
const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-4 text-[15px] gap-2 rounded-[10px]',
  lg: 'h-12 px-5 text-base gap-2.5 rounded-xl'
};
const iconSize: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-[18px] w-[18px]',
  lg: 'h-5 w-5'
};
export function ActionButton({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  fullWidth = false,
  loading = false,
  className = '',
  type = 'button',
  disabled,
  children,
  ...rest
}: ActionButtonProps) {
  const LeadIcon = loading ? Loader2Icon : Icon;
  return <button type={type} disabled={disabled || loading} className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 disabled:pointer-events-none disabled:opacity-60 ${variantClass[variant]} ${sizeClass[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...rest}>
      {LeadIcon && <LeadIcon className={`${iconSize[size]} shrink-0 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />}
      <span>{children}</span>
    </button>;
}