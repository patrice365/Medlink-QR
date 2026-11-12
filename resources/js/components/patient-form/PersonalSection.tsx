import React from 'react';
import type { PatientSectionProps } from '../../types/patient';
import { CIVIL_STATUSES, GENDER_OPTIONS, RELIGION_OPTIONS, SEX_OPTIONS } from '../../data/formOptions';
import { SelectWithOther } from '../forms/SelectWithOther';
import { computeAge } from '../../utils/patient';
import { NA_HINT, capitalizeWords } from '../../utils/text';
import { TextField } from '../forms/TextField';
import { ChoiceGroup } from '../forms/ChoiceGroup';
import { PhotoPicker } from '../forms/PhotoPicker';
import { FormBlock } from '../forms/FormBlock';

export function PersonalSection({ data, update, errors = {} }: PatientSectionProps) {
  const age = computeAge(data.dateOfBirth);
  return (
    <div className="space-y-10">
      <FormBlock title="Basic Information">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <PhotoPicker value={data.photo} onChange={(photo) => update({ photo })} />
          <div className="grid flex-1 gap-5">
            <TextField
              label="Surname"
              required
              autoComplete="family-name"
              placeholder="e.g. Dela Cruz"
              value={data.surname}
              error={errors.surname}
              onChange={(v) => update({ surname: capitalizeWords(v) })} />
            
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <TextField
                label="First Name"
                required
                autoComplete="given-name"
                placeholder="e.g. Juan"
                value={data.firstName}
                error={errors.firstName}
                onChange={(v) => update({ firstName: capitalizeWords(v) })} />
              
              <TextField
                label="Middle Name"
                required
                hint={NA_HINT}
                autoComplete="additional-name"
                placeholder="e.g. Santos"
                value={data.middleName}
                error={errors.middleName}
                onChange={(v) => update({ middleName: capitalizeWords(v) })} />
              
            </div>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-[1fr_140px] sm:gap-6">
          <TextField
            label="Date of Birth"
            type="date"
            required
            value={data.dateOfBirth}
            error={errors.dateOfBirth}
            onChange={(dateOfBirth) => update({ dateOfBirth })} />
          
          <TextField
            label="Age"
            readOnly
            hint="Auto"
            value={age === null ? '' : `${age} yrs`}
            placeholder="—"
            onChange={() => undefined} />
          
        </div>
        <ChoiceGroup
          label="Sex"
          required
          options={SEX_OPTIONS}
          value={data.sex}
          error={errors.sex}
          onChange={(sex) => update({ sex })} />
        
      </FormBlock>

      <FormBlock title="Identity & Civil Status">
        <ChoiceGroup
          label="Civil Status"
          required
          options={CIVIL_STATUSES}
          value={data.civilStatus}
          error={errors.civilStatus}
          onChange={(civilStatus) => update({ civilStatus })} />
        
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <TextField
            label="Citizenship"
            required
            placeholder="e.g. Filipino"
            value={data.citizenship}
            error={errors.citizenship}
            onChange={(citizenship) => update({ citizenship })} />
          
          <SelectWithOther
            label="Religion"
            required
            placeholder="Select religion"
            options={RELIGION_OPTIONS}
            value={data.religion}
            error={errors.religion}
            onChange={(religion) => update({ religion })} />
          
        </div>
        <SelectWithOther
          label="Gender"
          required
          placeholder="Select gender"
          options={GENDER_OPTIONS}
          value={data.genderIdentity}
          error={errors.genderIdentity}
          onChange={(genderIdentity) => update({ genderIdentity })} />
        
      </FormBlock>
    </div>);

}