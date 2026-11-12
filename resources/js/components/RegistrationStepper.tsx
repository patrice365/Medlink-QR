import React from 'react';
import { CheckIcon } from 'lucide-react';

interface RegistrationStepperProps {
  steps: {short: string;}[];
  current: number;
  onSelect: (index: number) => void;
}

export function RegistrationStepper({ steps, current, onSelect }: RegistrationStepperProps) {
  return (
    <nav aria-label="Registration progress">
      <ol className="flex items-start">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const last = index === steps.length - 1;
          return (
            <li key={step.short} className={`flex items-start ${last ? '' : 'flex-1'}`}>
              <button
                type="button"
                disabled={!done}
                onClick={() => onSelect(index)}
                aria-current={active ? 'step' : undefined}
                aria-label={`${step.short}${done ? ', completed' : active ? ', current step' : ''}`}
                className="group flex flex-col items-center gap-1.5 focus-visible:outline-none disabled:cursor-default">
                
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold transition-colors duration-200 ease-out group-focus-visible:ring-4 group-focus-visible:ring-brand-royal/20 ${
                  done ?
                  'bg-brand-royal text-white' :
                  active ?
                  'border-2 border-brand-royal bg-white text-brand-royal' :
                  'border border-line bg-white text-ink-faint'}`
                  }>
                  
                  {done ? <CheckIcon className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : index + 1}
                </span>
                <span
                  className={`hidden whitespace-nowrap text-xs sm:block ${
                  active ? 'font-semibold text-brand-navy' : done ? 'text-ink' : 'text-ink-soft'}`
                  }>
                  
                  {step.short}
                </span>
              </button>
              {!last &&
              <span
                className={`mx-2 mt-4 h-0.5 flex-1 rounded-full transition-colors duration-200 ${done ? 'bg-brand-royal' : 'bg-line'}`}
                aria-hidden="true" />

              }
            </li>);

        })}
      </ol>
    </nav>);

}