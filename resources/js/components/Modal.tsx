import React, { useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: 'md' | 'lg';
}

const EASE = [0.23, 1, 0.32, 1] as const;

export function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-brand-navy/40 sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}>
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.22, ease: EASE }}
          className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-white shadow-pop sm:rounded-2xl ${
          size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-md'}`
          }>
          
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
              <div>
                <h2 id={titleId} className="text-xl font-semibold text-brand-navy">
                  {title}
                </h2>
                {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft transition-colors duration-150 hover:bg-tint hover:text-brand-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-6 sm:px-8">{children}</div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}