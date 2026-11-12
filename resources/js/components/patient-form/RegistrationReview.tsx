import React from 'react';
import { format, parseISO } from 'date-fns';
import { CheckIcon, GraduationCapIcon, PencilIcon } from 'lucide-react';
import type { PatientRecord, PatientUpdate } from '../../types/patient';
import { computeAge, fullName, todayIso } from '../../utils/patient';
import { capitalizeWords } from '../../utils/text';
import { TextField } from '../forms/TextField';
import { SignatureUpload } from '../forms/SignatureUpload';
import { PatientAvatar } from '../PatientAvatar';
import { InfoChip } from '../ui/InfoChip';

interface RegistrationReviewProps {
  data: PatientRecord;
  update: PatientUpdate;
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
  onEdit: (step: number) => void;
  error?: string;
  nameError?: string;
  signatureError?: string;
}

function yesNo(value: boolean | null): string {
  if (value === null) return 'Not answered';
  return value ? 'Yes' : 'No';
}

export function RegistrationReview({
  data,
  update,
  agreed,
  onAgreeChange,
  onEdit,
  error,
  nameError,
  signatureError
}: RegistrationReviewProps) {
  const age = computeAge(data.dateOfBirth);
  const past = Object.entries(data.pastHistory).map(([c, a]) => a ? `${c} (age ${a})` : c);

  const groups: {step: number;title: string;rows: [string, string][];}[] = [
  {
    step: 0,
    title: 'Basic Information',
    rows: [
    ['Date of birth', data.dateOfBirth ? `${format(parseISO(data.dateOfBirth), 'MMMM d, yyyy')} · ${age} yrs` : '—'],
    ['Sex', data.sex || '—'],
    ['Civil status', data.civilStatus || '—'],
    ['Citizenship', data.citizenship || '—'],
    ['Religion', data.religion || '—'],
    ['Gender', data.genderIdentity || '—']]

  },
  {
    step: 1,
    title: 'Academic & Contact',
    rows: [
    ['Program', data.category === 'Employee' ? data.officeEmployed || '—' : data.program],
    ['Home address', data.homeAddress || '—'],
    ['Current address', data.currentAddress || '—'],
    ['Mobile number', data.contactNo],
    ['Email', data.email || '—'],
    ['Emergency contact', `${data.emergencyName}${data.emergencyRelation ? ` (${data.emergencyRelation})` : ''} · ${data.emergencyContact}`]]

  },
  {
    step: 2,
    title: 'Health History',
    rows: [
    ['Family history', data.familyHistory.length ? data.familyHistory.join(', ') : 'None'],
    ['Past illnesses', past.length ? past.join(', ') : 'None'],
    ['Allergy', data.allergy || 'None declared']]

  },
  {
    step: 3,
    title: 'Lifestyle',
    rows: [
    ['Smoker', yesNo(data.smoker)],
    ['Drinks alcohol', yesNo(data.drinker)]]

  }];


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 rounded-xl bg-canvas p-4">
        <PatientAvatar patient={data} size="md" />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-brand-navy">{fullName(data)}</p>
          <div className="mt-1.5">
            <InfoChip icon={GraduationCapIcon}>{data.program || '—'}</InfoChip>
          </div>
        </div>
      </div>

      <div className="divide-y divide-line">
        {groups.map((group) =>
        <section key={group.title} className="py-6 first:pt-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-brand-royal">{group.title}</h3>
              <button
              type="button"
              onClick={() => onEdit(group.step)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-secondary-ink transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
              
                <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" /> Edit
              </button>
            </div>
            <dl className="grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-[160px_1fr]">
              {group.rows.map(([label, value]) =>
            <React.Fragment key={label}>
                  <dt className="text-sm text-ink-soft">{label}</dt>
                  <dd className="mb-2 text-ink sm:mb-0">{value}</dd>
                </React.Fragment>
            )}
            </dl>
          </section>
        )}
      </div>

      <section className="space-y-5 border-t border-line pt-8">
        <h3 className="font-semibold text-brand-royal">Consent</h3>
        <button
          type="button"
          role="checkbox"
          aria-checked={agreed}
          onClick={() => onAgreeChange(!agreed)}
          className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-[background-color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${
          agreed ? 'border-brand-royal bg-tint' : error ? 'border-danger bg-white' : 'border-line bg-white'}`
          }>
          
          <span
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border ${
            agreed ? 'border-brand-royal bg-brand-royal text-white' : 'border-ink-faint'}`
            }
            aria-hidden="true">
            
            {agreed && <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
          <span className="text-[15px] leading-relaxed text-ink">
            I confirm this information is true and correct. I understand it is confidential and only the LNU Health
            Services Office can see my full record.
          </span>
        </button>
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <div className="grid gap-5 sm:grid-cols-[1fr_200px] sm:gap-6">
          <TextField
            label="Printed Name of Legal Guardian"
            required
            placeholder="e.g. Maria Dela Cruz"
            value={data.consentName}
            error={nameError}
            onChange={(v) => update({ consentName: capitalizeWords(v), consentDate: todayIso() })} />
          
          <TextField
            label="Date"
            type="date"
            readOnly
            hint="Today"
            value={data.consentDate || todayIso()}
            onChange={() => undefined} />
          
        </div>
        <SignatureUpload
          label="Digital Signature of Legal Guardian"
          hint="Photo of the guardian's signature"
          required
          value={data.consentSignature}
          error={signatureError}
          onChange={(consentSignature) => update({ consentSignature })} />
        
      </section>
    </div>);

}