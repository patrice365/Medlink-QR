import React from 'react';

export const LNU_LOGO_URL = "/Logo.png";
export const MEDLINK_LOGO_URL = "/Untitled_design_(1).png";

interface BrandMarkProps {
  inverted?: boolean;
  compact?: boolean;
}

export function BrandMark({ inverted = false, compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <img src={LNU_LOGO_URL} alt="Leyte Normal University seal" className="h-10 w-10 shrink-0 object-contain" />
      <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
        <img
          src={MEDLINK_LOGO_URL}
          alt="MedLink QR logo"
          className="absolute inset-0 h-full w-full scale-[1.2] object-contain object-center" />
        
      </span>
      <span className="leading-tight">
        <span className={`block text-[17px] font-semibold tracking-tight ${inverted ? 'text-white' : 'text-brand-navy'}`}>
          MedLink QR
        </span>
        {!compact &&
        <span className={`block font-serif text-[13px] font-semibold tracking-wide ${inverted ? 'text-brand-gold' : 'text-ink-soft'}`}>
            Leyte Normal University
          </span>
        }
      </span>
    </div>);

}