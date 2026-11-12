import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import type { VisitFilters } from '../../types/visit';
import { ActionButton } from '../ActionButton';
import { VisitFilterFields } from './VisitFilterFields';

interface VisitFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: VisitFilters;
  onChange: (patch: Partial<VisitFilters>) => void;
  onClear: () => void;
  physicians: string[];
  resultCount: number;
}

const EASE = [0.23, 1, 0.32, 1] as const;

export function VisitFilterDrawer({ open, onClose, filters, onChange, onClear, physicians, resultCount }: VisitFilterDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <>
          <motion.div
          className="fixed inset-0 z-50 bg-brand-navy/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={onClose} />
        
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label="Filter visits"
          initial={{ x: 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 32, opacity: 0 }}
          transition={{ duration: 0.24, ease: EASE }}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-line bg-white shadow-pop">
          
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="text-lg font-semibold text-brand-navy">Filters</h2>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors duration-150 hover:bg-tint hover:text-brand-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <VisitFilterFields filters={filters} onChange={onChange} physicians={physicians} stacked />
            </div>
            <div className="flex gap-3 border-t border-line px-6 py-4">
              <ActionButton variant="ghost" onClick={onClear}>
                Clear all
              </ActionButton>
              <ActionButton className="flex-1" onClick={onClose}>
                Show {resultCount} {resultCount === 1 ? 'visit' : 'visits'}
              </ActionButton>
            </div>
          </motion.aside>
        </>
      }
    </AnimatePresence>);

}