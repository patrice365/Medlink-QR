import React from 'react';
import type { PatientSectionProps } from '../../types/patient';
import { CATEGORY_OPTIONS, PROGRAM_OPTIONS, YEAR_OPTIONS } from '../../data/formOptions';
import { composeProgram, parseProgram } from '../../utils/patient';
import { SelectWithOther } from '../forms/SelectWithOther';
import { NA_HINT, capitalizeWords } from '../../utils/text';
import { TextField } from '../forms/TextField';
import { ChoiceGroup } from '../forms/ChoiceGroup';
import { FormBlock } from '../forms/FormBlock';

export function SchoolContactSection({ data, update, errors = {} }: PatientSectionProps) {
  const isEmployee = data.category === 'Employee';
  const parts = data.programName || data.yearLevel || data.section ? data : parseProgram(data.program);
  const { programName, yearLevel, section } = parts;

  const setProgram = (patch: Partial<{programName: string;yearLevel: string;section: string;}>) => {
    const next = { programName, yearLevel, section, ...patch };
    update({ ...next, program: composeProgram(next.programName, next.yearLevel, next.section) });
  };
  return (
    <div className="space-y-10">
      <FormBlock title="Academic Information">
        <ChoiceGroup
          label="Patient Category"
          required
          options={CATEGORY_OPTIONS}
          value={data.category}
          error={errors.category}
          onChange={(category) => update({ category })} />
        
        {data.category === 'Other' &&
        <TextField
          label="Please Specify"
          required
          value={data.categoryOther}
          error={errors.categoryOther}
          onChange={(categoryOther) => update({ categoryOther })} />

        }
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <TextField
            label="Student Number"
            required
            hint={isEmployee ? NA_HINT : undefined}
            inputMode={isEmployee ? 'text' : 'numeric'}
            placeholder="e.g. 0000000"
            value={data.studentNo ?? ''}
            error={errors.studentNo}
            onChange={(studentNo) => update({ studentNo })} />
          
          {isEmployee &&
          <TextField
            label="Office / Year Employed at LNU"
            required
            value={data.officeEmployed}
            error={errors.officeEmployed}
            onChange={(officeEmployed) => update({ officeEmployed })} />

          }
        </div>
        {!isEmployee &&
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.8fr)] sm:gap-6">
            <SelectWithOther
            label="Program"
            required
            placeholder="Select program"
            options={PROGRAM_OPTIONS}
            value={programName}
            error={errors.programName}
            onChange={(v) => setProgram({ programName: v })} />
          
            <SelectWithOther
            label="Year Level"
            required
            placeholder="Select year"
            options={YEAR_OPTIONS}
            otherLabel="Other"
            otherPlaceholder="e.g. Irregular"
            value={yearLevel}
            error={errors.yearLevel}
            onChange={(v) => setProgram({ yearLevel: v })} />
          
            <TextField
            label="Section"
            required
            placeholder="e.g. A"
            value={section}
            error={errors.section}
            onChange={(v) => setProgram({ section: v.toUpperCase() })} />
          
          </div>
        }
        <TextField
          label="Previous School Attended"
          required
          hint={NA_HINT}
          placeholder="Enter school name"
          value={data.lastSchool}
          error={errors.lastSchool}
          onChange={(lastSchool) => update({ lastSchool })} />
        
      </FormBlock>

      <FormBlock title="Contact Information">
        <TextField
          label="Home Address"
          required
          multiline
          rows={2}
          autoComplete="street-address"
          placeholder="House no., street, barangay, city"
          value={data.homeAddress}
          error={errors.homeAddress}
          onChange={(homeAddress) => update({ homeAddress })} />
        
        <div>
          <TextField
            label="Current Address"
            required
            multiline
            rows={2}
            placeholder="Where you stay while studying, e.g. boarding house or dormitory"
            value={data.currentAddress ?? ''}
            error={errors.currentAddress}
            onChange={(currentAddress) => update({ currentAddress })} />
          
          <button
            type="button"
            onClick={() => update({ currentAddress: data.homeAddress })}
            disabled={!data.homeAddress.trim()}
            className="mt-1 inline-flex h-11 items-center rounded-lg px-2 text-sm font-medium text-brand-royal transition-colors duration-150 hover:text-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 disabled:text-ink-faint">
            
            Same as home address
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <TextField
            label="Mobile Number"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. 09171234567"
            value={data.contactNo}
            error={errors.contactNo}
            onChange={(contactNo) => update({ contactNo })} />
          
          <TextField
            label="Email Address"
            required
            hint={NA_HINT}
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="e.g. you@lnu.edu.ph"
            value={data.email}
            error={errors.email}
            onChange={(email) => update({ email })} />
          
        </div>
      </FormBlock>

      <FormBlock title="Emergency Contact Details" description="Who the clinic should call if you need urgent care.">
        <TextField
          label="Full Name"
          required
          placeholder="e.g. Maria Dela Cruz"
          value={data.emergencyName}
          error={errors.emergencyName}
          onChange={(v) => update({ emergencyName: capitalizeWords(v) })} />
        
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <TextField
            label="Relationship"
            required
            placeholder="e.g. Mother"
            value={data.emergencyRelation}
            error={errors.emergencyRelation}
            onChange={(v) => update({ emergencyRelation: capitalizeWords(v) })} />
          
          <TextField
            label="Mobile Number"
            required
            type="tel"
            inputMode="tel"
            placeholder="e.g. 09181112233"
            value={data.emergencyContact}
            error={errors.emergencyContact}
            onChange={(emergencyContact) => update({ emergencyContact })} />
          
        </div>
      </FormBlock>
    </div>);

}