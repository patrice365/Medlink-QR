import type { FieldErrors, PatientRecord } from '../types/patient';
import { computeAge } from './patient';

const PH_MOBILE = /^(09|\+639)\d{9}$/;

function cleanPhone(value: string): string {
  return value.replace(/[\s-]/g, '');
}

function isNA(value: string): boolean {
  return /^n\/?a$/i.test(value.trim());
}

/** Every text answer is required; students type N/A when a question doesn't apply. */
function need(e: FieldErrors, key: keyof PatientRecord, value: string | undefined, label: string) {
  if (!(value ?? '').trim()) e[key] = `${label} is required. Type N/A if none.`;
}

export function validateStep(step: number, p: PatientRecord, agreed: boolean): FieldErrors {
  const e: FieldErrors = {};

  if (step === 0) {
    need(e, 'surname', p.surname, 'Surname');
    need(e, 'firstName', p.firstName, 'First name');
    need(e, 'middleName', p.middleName, 'Middle name');
    if (!p.dateOfBirth) e.dateOfBirth = 'Select your date of birth';else
    if (computeAge(p.dateOfBirth) === null) e.dateOfBirth = 'Date of birth cannot be in the future';
    if (!p.sex) e.sex = 'Select your sex';
    if (!p.civilStatus) e.civilStatus = 'Select your civil status';
    need(e, 'citizenship', p.citizenship, 'Citizenship');
    need(e, 'religion', p.religion, 'Religion');
    need(e, 'genderIdentity', p.genderIdentity, 'Gender identity');
  }

  if (step === 1) {
    if (!p.category) e.category = 'Select your patient category';
    if (p.category === 'Other') need(e, 'categoryOther', p.categoryOther, 'Category');
    need(e, 'studentNo', p.studentNo, 'Student number');
    if (p.category === 'Employee') need(e, 'officeEmployed', p.officeEmployed, 'Office / year employed');else
    {
      if (!p.programName?.trim()) e.programName = 'Select your program';
      if (!p.yearLevel?.trim()) e.yearLevel = 'Select your year level';
      if (!p.section?.trim()) e.section = 'Enter your section';
    }
    need(e, 'lastSchool', p.lastSchool, 'Previous school attended');
    need(e, 'homeAddress', p.homeAddress, 'Home address');
    need(e, 'currentAddress', p.currentAddress, 'Current address');
    if (!PH_MOBILE.test(cleanPhone(p.contactNo))) e.contactNo = 'Use an 11-digit mobile number, e.g. 09171234567';
    if (!p.email.trim()) e.email = 'Email address is required. Type N/A if none.';else
    if (!isNA(p.email) && !/^\S+@\S+\.\S+$/.test(p.email.trim())) e.email = 'Check the email format, e.g. you@lnu.edu.ph';
    need(e, 'emergencyName', p.emergencyName, 'Emergency contact name');
    need(e, 'emergencyRelation', p.emergencyRelation, 'Relationship');
    if (!PH_MOBILE.test(cleanPhone(p.emergencyContact))) e.emergencyContact = 'Use an 11-digit mobile number for your emergency contact';
  }

  if (step === 2) {
    need(e, 'familyOther', p.familyOther, 'Other family history');
    need(e, 'allergy', p.allergy, 'Allergy');
    need(e, 'hospitalizations', p.hospitalizations, 'Previous hospitalizations');
    need(e, 'surgeries', p.surgeries, 'Previous surgical operations');
    need(e, 'otherIllnesses', p.otherIllnesses, 'Other illnesses');
  }

  if (step === 3) {
    if (p.smoker === null) e.smoker = 'Answer whether you smoke';
    if (p.smoker) {
      need(e, 'smokingDuration', p.smokingDuration, 'Smoking duration');
      need(e, 'sticksPerDay', p.sticksPerDay, 'Sticks per day');
    }
    if (p.drinker === null) e.drinker = 'Answer whether you drink alcohol';
    if (p.drinker) {
      need(e, 'drinkingFrequency', p.drinkingFrequency, 'Drinking frequency');
      need(e, 'glassesPerSession', p.glassesPerSession, 'Glasses per session');
    }
    if (p.sex === 'Female') {
      if (p.previousPregnancy === null) e.previousPregnancy = 'Answer whether you had a previous pregnancy';
      if (p.previousPregnancy) {
        need(e, 'pregnancies', p.pregnancies, 'Number of pregnancies');
        if (!p.lastDelivery) e.lastDelivery = 'Select the date of your last delivery';
      }
      if (!p.lastMenstrualPeriod) e.lastMenstrualPeriod = 'Select the first day of your last menstrual period';
      need(e, 'menstrualDays', p.menstrualDays, 'Number of days');
    }
  }

  if (step === 4) {
    if (!agreed) e.agreement = 'Please confirm your information to continue';
    need(e, 'consentName', p.consentName, "Guardian's printed name");
    if (!p.consentSignature) e.consentSignature = "Please upload a photo of your guardian's signature";
  }

  return e;
}