import React from 'react';
import type { PatientSectionProps } from '../../types/patient';
import { FAMILY_CONDITIONS, PAST_CONDITIONS } from '../../data/formOptions';
import { NA_HINT } from '../../utils/text';
import { TextField } from '../forms/TextField';
import { CheckChip } from '../forms/CheckChip';
import { FormBlock } from '../forms/FormBlock';

export function HealthHistorySection({ data, update, errors = {} }: PatientSectionProps) {
  const toggleFamily = (condition: string) => {
    const has = data.familyHistory.includes(condition);
    update({
      familyHistory: has ? data.familyHistory.filter((c) => c !== condition) : [...data.familyHistory, condition]
    });
  };

  const togglePast = (condition: string) => {
    const next = { ...data.pastHistory };
    if (condition in next) delete next[condition];else
    next[condition] = '';
    update({ pastHistory: next });
  };

  return (
    <div className="space-y-8">
      <FormBlock title="Family History" description="Illnesses any relative up to first degree (parents, siblings, children) has had.">
        <div className="grid gap-3 sm:grid-cols-2">
          {FAMILY_CONDITIONS.map((condition) =>
          <CheckChip
            key={condition}
            label={condition}
            checked={data.familyHistory.includes(condition)}
            onToggle={() => toggleFamily(condition)} />

          )}
        </div>
        <TextField
          label="Others"
          required
          hint={NA_HINT}
          placeholder="Please specify"
          value={data.familyOther}
          error={errors.familyOther}
          onChange={(familyOther) => update({ familyOther })} />
        
      </FormBlock>

      <FormBlock title="Past Medical History" description="Illnesses you already had. Add the age you had it if you remember.">
        <div className="grid gap-3 sm:grid-cols-2">
          {PAST_CONDITIONS.map((condition) => {
            const checked = condition in data.pastHistory;
            return (
              <div key={condition} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <CheckChip label={condition} checked={checked} onToggle={() => togglePast(condition)} />
                </div>
                {checked &&
                <input
                  aria-label={`Age when you had ${condition}`}
                  inputMode="numeric"
                  placeholder="Age"
                  value={data.pastHistory[condition]}
                  onChange={(e) => update({ pastHistory: { ...data.pastHistory, [condition]: e.target.value } })}
                  className="h-11 w-20 rounded-[10px] border border-line bg-white px-3 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand-royal focus:outline-none focus:ring-4 focus:ring-brand-royal/15" />

                }
              </div>);

          })}
        </div>
      </FormBlock>

      <FormBlock title="Allergies & Other History">
        <TextField
          label="Allergy"
          required
          hint={NA_HINT}
          multiline
          rows={2}
          placeholder="Triggering factors / allergens, e.g. Penicillin, shellfish, dust"
          value={data.allergy}
          error={errors.allergy}
          onChange={(allergy) => update({ allergy })} />
        
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <TextField
            label="Previous Hospitalizations (mm/dd/yy)"
            required
            hint={NA_HINT}
            multiline
            rows={2}
            placeholder="e.g. Dengue fever – 08/15/23"
            value={data.hospitalizations}
            error={errors.hospitalizations}
            onChange={(hospitalizations) => update({ hospitalizations })} />
          
          <TextField
            label="Previous Surgical Operations"
            required
            hint={NA_HINT}
            multiline
            rows={2}
            value={data.surgeries}
            error={errors.surgeries}
            onChange={(surgeries) => update({ surgeries })} />
          
        </div>
        <TextField
          label="Other Illnesses"
          required
          hint={NA_HINT}
          value={data.otherIllnesses}
          error={errors.otherIllnesses}
          onChange={(otherIllnesses) => update({ otherIllnesses })} />
        
      </FormBlock>
    </div>);

}