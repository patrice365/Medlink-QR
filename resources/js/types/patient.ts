export type Sex = 'Female' | 'Male';
export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated';
export type PatientCategory = 'ILS' | 'CoEd' | 'CME' | 'CAS' | 'Graduate Student' | 'Employee' | 'Other';
export type YesNo = 'Yes' | 'No';

export interface ClinicalRecord {
  dateTime: string;
  chiefComplaint: string;
  presentIllness: string;
  weight: string;
  height: string;
  bp: string;
  hr: string;
  rr: string;
  temp: string;
  obGravida: string;
  obPara: string;
  previousDeliveries: string;
  lmp: string;
  aog: string;
  edc: string;
  midas: string;
  otherRemarks: string;
  physicalExam: Record<string, string>;
  assessment: string;
  diagnosis: string;
  treatment: string;
  plan: string;
  followUpDate: string;
  physician: string;
}

export interface PatientRecord {
  id: string;
  clinicNo: string;
  registeredAt: string;
  photo: string;
  surname: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
  sex: Sex | '';
  genderIdentity: string;
  civilStatus: CivilStatus | '';
  citizenship: string;
  religion: string;
  category: PatientCategory | '';
  categoryOther: string;
  studentNo: string;
  /** Combined label shown across the app, e.g. "BLIS 3-A". Built from programName, yearLevel and section. */
  program: string;
  programName: string;
  yearLevel: string;
  section: string;
  officeEmployed: string;
  homeAddress: string;
  currentAddress: string;
  email: string;
  contactNo: string;
  lastSchool: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyContact: string;
  familyHistory: string[];
  familyOther: string;
  pastHistory: Record<string, string>;
  allergy: string;
  hospitalizations: string;
  surgeries: string;
  otherIllnesses: string;
  smoker: boolean | null;
  smokingDuration: string;
  sticksPerDay: string;
  drinker: boolean | null;
  drinkingFrequency: string;
  glassesPerSession: string;
  previousPregnancy: boolean | null;
  pregnancies: string;
  lastDelivery: string;
  lastMenstrualPeriod: string;
  menstrualDays: string;
  consentName: string;
  consentDate: string;
  consentSignature: string;
  clinical: ClinicalRecord;
}

export type PatientSeed = Omit<Partial<PatientRecord>, 'clinical'> & {
  id: string;
  clinical?: Partial<ClinicalRecord>;
};

export type PatientUpdate = (patch: Partial<PatientRecord>) => void;
export type FieldErrors = Partial<Record<keyof PatientRecord | 'agreement', string>>;

export interface PatientSectionProps {
  data: PatientRecord;
  update: PatientUpdate;
  errors?: FieldErrors;
}