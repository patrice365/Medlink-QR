import React from 'react';
import type { PatientSectionProps, YesNo } from '../../types/patient';
import { YES_NO } from '../../data/formOptions';
import { TextField } from '../forms/TextField';
import { ChoiceGroup } from '../forms/ChoiceGroup';
import { FormBlock } from '../forms/FormBlock';

function toYesNo(value: boolean | null): YesNo | '' {
  if (value === null) return '';
  return value ? 'Yes' : 'No';
}

export function LifestyleSection({ data, update, errors = {} }: PatientSectionProps) {
  return (
    <div className="space-y-8">
      <FormBlock title="Smoking">
        <ChoiceGroup
          label="Are you a cigarette smoker?"
          required
          options={YES_NO}
          value={toYesNo(data.smoker)}
          error={errors.smoker}
          onChange={(v) => update({ smoker: v === 'Yes' })} />
        
        {data.smoker &&
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            <TextField
            label="For how long?"
            required
            placeholder="e.g. 2 years"
            value={data.smokingDuration}
            error={errors.smokingDuration}
            onChange={(smokingDuration) => update({ smokingDuration })} />
          
            <TextField
            label="Sticks per Day"
            required
            inputMode="numeric"
            value={data.sticksPerDay}
            error={errors.sticksPerDay}
            onChange={(sticksPerDay) => update({ sticksPerDay })} />
          
          </div>
        }
      </FormBlock>

      <FormBlock title="Alcohol">
        <ChoiceGroup
          label="Do you drink alcoholic beverages?"
          required
          options={YES_NO}
          value={toYesNo(data.drinker)}
          error={errors.drinker}
          onChange={(v) => update({ drinker: v === 'Yes' })} />
        
        {data.drinker &&
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            <TextField
            label="How often?"
            required
            placeholder="e.g. Once a month"
            value={data.drinkingFrequency}
            error={errors.drinkingFrequency}
            onChange={(drinkingFrequency) => update({ drinkingFrequency })} />
          
            <TextField
            label="Glasses per Session"
            required
            inputMode="numeric"
            value={data.glassesPerSession}
            error={errors.glassesPerSession}
            onChange={(glassesPerSession) => update({ glassesPerSession })} />
          
          </div>
        }
      </FormBlock>

      {data.sex === 'Female' &&
      <FormBlock title="Obstetric History" description="For women only.">
          <ChoiceGroup
          label="Previous pregnancy?"
          required
          options={YES_NO}
          value={toYesNo(data.previousPregnancy)}
          error={errors.previousPregnancy}
          onChange={(v) => update({ previousPregnancy: v === 'Yes' })} />
        
          {data.previousPregnancy &&
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <TextField
            label="Number of Pregnancies"
            required
            inputMode="numeric"
            value={data.pregnancies}
            error={errors.pregnancies}
            onChange={(pregnancies) => update({ pregnancies })} />
          
              <TextField
            label="Date of Last Delivery"
            required
            type="date"
            value={data.lastDelivery}
            error={errors.lastDelivery}
            onChange={(lastDelivery) => update({ lastDelivery })} />
          
            </div>
        }
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            <TextField
            label="Last Menstrual Period (First Day)"
            required
            type="date"
            value={data.lastMenstrualPeriod}
            error={errors.lastMenstrualPeriod}
            onChange={(lastMenstrualPeriod) => update({ lastMenstrualPeriod })} />
          
            <TextField
            label="Number of Days"
            required
            inputMode="numeric"
            value={data.menstrualDays}
            error={errors.menstrualDays}
            onChange={(menstrualDays) => update({ menstrualDays })} />
          
          </div>
        </FormBlock>
      }
    </div>);

}