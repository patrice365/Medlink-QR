import type { ClinicalRecord, PatientRecord, PatientSeed } from '../types/patient';

export function emptyClinical(): ClinicalRecord {
  return {
    dateTime: '',
    chiefComplaint: '',
    presentIllness: '',
    weight: '',
    height: '',
    bp: '',
    hr: '',
    rr: '',
    temp: '',
    obGravida: '',
    obPara: '',
    previousDeliveries: '',
    lmp: '',
    aog: '',
    edc: '',
    midas: '',
    otherRemarks: '',
    physicalExam: {},
    assessment: '',
    diagnosis: '',
    treatment: '',
    plan: '',
    followUpDate: '',
    physician: ''
  };
}

export function emptyPatient(): PatientRecord {
  return {
    id: '',
    clinicNo: '',
    registeredAt: '',
    photo: '',
    surname: '',
    firstName: '',
    middleName: '',
    dateOfBirth: '',
    sex: '',
    genderIdentity: '',
    civilStatus: '',
    citizenship: 'Filipino',
    religion: '',
    category: 'CAS',
    categoryOther: '',
    studentNo: '',
    program: '',
    programName: '',
    yearLevel: '',
    section: '',
    officeEmployed: '',
    homeAddress: '',
    currentAddress: '',
    email: '',
    contactNo: '',
    lastSchool: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyContact: '',
    familyHistory: [],
    familyOther: '',
    pastHistory: {},
    allergy: '',
    hospitalizations: '',
    surgeries: '',
    otherIllnesses: '',
    smoker: null,
    smokingDuration: '',
    sticksPerDay: '',
    drinker: null,
    drinkingFrequency: '',
    glassesPerSession: '',
    previousPregnancy: null,
    pregnancies: '',
    lastDelivery: '',
    lastMenstrualPeriod: '',
    menstrualDays: '',
    consentName: '',
    consentDate: '',
    consentSignature: '',
    clinical: emptyClinical()
  };
}

/** Combines the program parts into the short label used across the app, e.g. "BLIS 3-A". */
export function composeProgram(programName: string, yearLevel: string, section: string): string {
  const yearSection = [yearLevel, section].filter((v) => v.trim()).join('-');
  return [programName.trim(), yearSection].filter(Boolean).join(' ');
}

/** Splits an older combined label like "BLIS 3-A" back into its parts. */
export function parseProgram(program: string): {programName: string;yearLevel: string;section: string;} {
  const match = program.trim().match(/^(.*?)\s+(\d+)-(.+)$/);
  if (!match) return { programName: program.trim(), yearLevel: '', section: '' };
  return { programName: match[1], yearLevel: match[2], section: match[3] };
}

export function hydrateSeed(seed: PatientSeed): PatientRecord {
  const base = { ...emptyPatient(), ...seed, clinical: { ...emptyClinical(), ...seed.clinical } };
  if (!base.programName && base.program) Object.assign(base, parseProgram(base.program));
  return base;
}

export function fullName(p: Pick<PatientRecord, 'firstName' | 'middleName' | 'surname'>): string {
  const middle = p.middleName.trim() ? `${p.middleName.trim()[0]}.` : '';
  return [p.firstName.trim(), middle, p.surname.trim()].filter(Boolean).join(' ');
}

export function initials(p: Pick<PatientRecord, 'firstName' | 'surname'>): string {
  return `${p.firstName.trim()[0] ?? ''}${p.surname.trim()[0] ?? ''}`.toUpperCase();
}

export function computeAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || m === 0 && now.getDate() < birth.getDate()) age -= 1;
  return age >= 0 ? age : null;
}

export function computeBmi(weight: string, height: string): string {
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100;
  if (!Number.isFinite(w) || !Number.isFinite(h) || h <= 0) return '';
  return (w / (h * h)).toFixed(1);
}

export function newRecordId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 4);
  return `ML-${stamp}${rand}`;
}

export function newClinicNo(existingCount: number): string {
  return `${new Date().getFullYear()}-${String(101 + existingCount).padStart(4, '0')}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}