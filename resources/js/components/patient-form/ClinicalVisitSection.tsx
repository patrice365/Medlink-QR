import React from 'react';
import type { ClinicalRecord, PatientSectionProps } from '../../types/patient';
import { PHYSICAL_EXAM_AREAS } from '../../data/formOptions';
import { computeBmi } from '../../utils/patient';
import { TextField } from '../forms/TextField';
import { FormBlock } from '../forms/FormBlock';

export function ClinicalVisitSection({ data, update }: PatientSectionProps) {
  const c = data.clinical;
  const set = (patch: Partial<ClinicalRecord>) => update({ clinical: { ...c, ...patch } });
  const bmi = computeBmi(c.weight, c.height);

  return (
    <div className="space-y-8">
      <FormBlock title="Visit Details">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <TextField label="Date / time" type="datetime-local" value={c.dateTime} onChange={(dateTime) => set({ dateTime })} />
          <TextField label="Examining physician" value={c.physician} onChange={(physician) => set({ physician })} />
        </div>
        <TextField
          label="Chief complaint"
          multiline
          rows={2}
          value={c.chiefComplaint}
          onChange={(chiefComplaint) => set({ chiefComplaint })} />
        
        <TextField
          label="History of present illness"
          multiline
          rows={4}
          value={c.presentIllness}
          onChange={(presentIllness) => set({ presentIllness })} />
        
      </FormBlock>

      <FormBlock title="Vital Signs">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          <TextField label="Weight" suffix="kg" inputMode="decimal" value={c.weight} onChange={(weight) => set({ weight })} />
          <TextField label="Height" suffix="cm" inputMode="decimal" value={c.height} onChange={(height) => set({ height })} />
          <TextField label="BMI" suffix="kg/m²" readOnly value={bmi} onChange={() => undefined} />
          <TextField label="Blood pressure" suffix="mmHg" placeholder="120/80" value={c.bp} onChange={(bp) => set({ bp })} />
          <TextField label="Heart rate" suffix="bpm" inputMode="numeric" value={c.hr} onChange={(hr) => set({ hr })} />
          <TextField label="Resp. rate" suffix="cpm" inputMode="numeric" value={c.rr} onChange={(rr) => set({ rr })} />
          <TextField label="Temperature" suffix="°C" inputMode="decimal" value={c.temp} onChange={(temp) => set({ temp })} />
        </div>
      </FormBlock>

      <FormBlock title="Physical Examination">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          {PHYSICAL_EXAM_AREAS.map((area) =>
          <TextField
            key={area}
            label={area}
            value={c.physicalExam[area] ?? ''}
            onChange={(value) => set({ physicalExam: { ...c.physicalExam, [area]: value } })} />

          )}
        </div>
      </FormBlock>

      {data.sex === 'Female' &&
      <FormBlock title="Obstetric History">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-5 md:gap-6">
            <TextField label="G" inputMode="numeric" value={c.obGravida} onChange={(obGravida) => set({ obGravida })} />
            <TextField label="P" inputMode="numeric" value={c.obPara} onChange={(obPara) => set({ obPara })} />
            <TextField label="LMP" type="date" value={c.lmp} onChange={(lmp) => set({ lmp })} />
            <TextField label="AOG" value={c.aog} onChange={(aog) => set({ aog })} />
            <TextField label="EDC" type="date" value={c.edc} onChange={(edc) => set({ edc })} />
          </div>
          <TextField
          label="Previous deliveries"
          value={c.previousDeliveries}
          onChange={(previousDeliveries) => set({ previousDeliveries })} />
        
        </FormBlock>
      }

      <FormBlock title="Notes">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <TextField label="M.I.D.A.S." multiline rows={3} value={c.midas} onChange={(midas) => set({ midas })} />
          <TextField label="Other remarks" multiline rows={3} value={c.otherRemarks} onChange={(otherRemarks) => set({ otherRemarks })} />
        </div>
      </FormBlock>

      <FormBlock title="Assessment, Diagnosis & Treatment">
        <TextField label="Assessment" multiline rows={3} value={c.assessment} onChange={(assessment) => set({ assessment })} />
        <TextField label="Diagnosis" value={c.diagnosis} onChange={(diagnosis) => set({ diagnosis })} />
        <TextField
          label="Treatment / medication"
          multiline
          rows={2}
          placeholder="e.g. Paracetamol 500 mg every 4 hours as needed"
          value={c.treatment}
          onChange={(treatment) => set({ treatment })} />
        
        <TextField label="Plan / management" multiline rows={3} value={c.plan} onChange={(plan) => set({ plan })} />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <TextField
            label="Follow-up date"
            type="date"
            hint="Leave blank if none"
            value={c.followUpDate}
            onChange={(followUpDate) => set({ followUpDate })} />
          
        </div>
      </FormBlock>
    </div>);

}