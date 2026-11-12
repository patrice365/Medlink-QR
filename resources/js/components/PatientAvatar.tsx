import React from 'react';
import type { PatientRecord } from '../types/patient';
import { fullName, initials } from '../utils/patient';

interface PatientAvatarProps {
  patient: PatientRecord;
  size?: 'sm' | 'md' | 'xl';
}

const sizes = {
  sm: 'h-10 w-10 text-sm rounded-full',
  md: 'h-14 w-14 text-base rounded-2xl',
  xl: 'h-28 w-28 text-2xl rounded-2xl'
};

export function PatientAvatar({ patient, size = 'sm' }: PatientAvatarProps) {
  if (patient.photo) {
    return (
      <img
        src={patient.photo}
        alt={`Photo of ${fullName(patient)}`}
        className={`${sizes[size]} shrink-0 object-cover ring-1 ring-line`} />);


  }
  return (
    <span
      className={`${sizes[size]} grid shrink-0 place-items-center bg-tint font-semibold text-brand-royal`}
      aria-hidden="true">
      
      {initials(patient)}
    </span>);

}