import type { CivilStatus, PatientCategory, Sex, YesNo } from '../types/patient';

export const SEX_OPTIONS: readonly Sex[] = ['Female', 'Male'];
export const YES_NO: readonly YesNo[] = ['Yes', 'No'];
export const CIVIL_STATUSES: readonly CivilStatus[] = ['Single', 'Married', 'Widowed', 'Separated'];
export const CATEGORY_OPTIONS: readonly PatientCategory[] = [
'CAS',
'CoEd',
'CME',
'ILS',
'Graduate Student',
'Employee',
'Other'];


const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

export const GENDER_OPTIONS = toOptions(['Male', 'Female', 'Transgender', 'Non-binary', 'Prefer not to say']);

export const RELIGION_OPTIONS = toOptions([
'Roman Catholic',
'Iglesia ni Cristo',
'Islam',
'Born Again Christian',
'Seventh-day Adventist',
'Aglipayan',
"Jehovah's Witness",
'Baptist',
'Latter-day Saints',
'None']
);

export const PROGRAM_OPTIONS = [
{ value: 'BLIS', label: 'BLIS – Library & Information Science' },
{ value: 'BSIT', label: 'BSIT – Information Technology' },
{ value: 'BSSW', label: 'BSSW – Social Work' },
{ value: 'AB English', label: 'AB English Language' },
{ value: 'AB PolSci', label: 'AB Political Science' },
{ value: 'BA Comm', label: 'BA Communication' },
{ value: 'BS Bio', label: 'BS Biology' },
{ value: 'BEEd', label: 'BEEd – Elementary Education' },
{ value: 'BSEd', label: 'BSEd – Secondary Education' },
{ value: 'BPEd', label: 'BPEd – Physical Education' },
{ value: 'BECEd', label: 'BECEd – Early Childhood Education' },
{ value: 'BTLEd', label: 'BTLEd – Technology & Livelihood Education' },
{ value: 'BSHM', label: 'BSHM – Hospitality Management' },
{ value: 'BSTM', label: 'BSTM – Tourism Management' },
{ value: 'BS Entrep', label: 'BS Entrepreneurship' }];


export const YEAR_OPTIONS = [
{ value: '1', label: '1st Year' },
{ value: '2', label: '2nd Year' },
{ value: '3', label: '3rd Year' },
{ value: '4', label: '4th Year' },
{ value: '5', label: '5th Year' }];


export const FAMILY_CONDITIONS = [
'Bronchial Asthma',
'Hypertension',
'Heart Disease',
'Stroke/Cerebrovascular Accident',
'Diabetes',
'Kidney Disease',
'Cancer',
'Allergies',
'Tuberculosis',
'Mental Illness'];


export const PAST_CONDITIONS = [
'Chickenpox',
'Measles',
'Mumps',
'Poliomyelitis',
'Hepatitis',
'Tuberculosis',
'Pneumonia',
'Typhoid Fever',
'Bronchial Asthma',
'Dengue',
'Epilepsy (Convulsion)',
'Diabetes',
'Hypertension',
'Mental Illness'];


export const PHYSICAL_EXAM_AREAS = [
'Gen. Status',
'Skin',
'Head',
'Eyes',
'Ears',
'Nose',
'Throat',
'Neck',
'Chest & Lungs',
'Heart',
'Abdomen',
'Extremities',
'Other'];


export const REGISTRATION_STEPS = [
{ title: 'Student Information', short: 'Personal', description: 'As written on your school records.' },
{ title: 'School & Contact', short: 'Contact', description: 'How we reach you, and who to call in an emergency.' },
{ title: 'Health History', short: 'History', description: "Tick anything that applies. Skip what doesn't." },
{ title: 'Lifestyle', short: 'Lifestyle', description: 'Answered privately. Only the clinic sees this.' },
{ title: 'Review & Submit', short: 'Review', description: 'Check your details, then get your QR code.' }];