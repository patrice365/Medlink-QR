import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { VisitRecord } from '../../types/visit';
import { VisitCard } from './VisitCard';

interface VisitTimelineProps {
  visits: VisitRecord[];
  mostRecentId?: string;
  onOpen: (visit: VisitRecord) => void;
}

export function VisitTimeline({ visits, mostRecentId, onOpen }: VisitTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <ol aria-label="Clinic visits, newest first" className="relative">
      {visits.map((visit, index) => {
        const recent = visit.id === mostRecentId;
        const last = index === visits.length - 1;
        return (
          <motion.li
            key={visit.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index, 5) * 0.04, ease: [0.23, 1, 0.32, 1] }}
            className={`relative pl-10 sm:pl-14 ${last ? '' : 'pb-5'}`}>
            
            {!(index === 0 && last) &&
            <span
              className={`absolute left-[15px] w-px bg-line sm:left-[23px] ${index === 0 ? 'top-8' : 'top-0'} ${last ? 'h-8' : 'bottom-0'}`}
              aria-hidden="true" />

            }
            {recent ?
            <span
              className="absolute left-[6px] top-[22px] h-[19px] w-[19px] rounded-full border-[3px] border-white bg-brand-royal ring-4 ring-brand-royal/20 sm:left-[14px]"
              aria-hidden="true" /> :


            <span
              className="absolute left-[10px] top-[26px] h-[11px] w-[11px] rounded-full border-2 border-white bg-ink-faint ring-1 ring-line sm:left-[18px]"
              aria-hidden="true" />

            }
            <VisitCard visit={visit} mostRecent={recent} onOpen={onOpen} />
          </motion.li>);

      })}
    </ol>);

}