import { BadgeCheckIcon, BuildingIcon, HospitalIcon, LockIcon, QrCodeIcon, ScanLineIcon, UserPlusIcon, FileHeartIcon, GraduationCapIcon } from 'lucide-react';

export const heroChips = [
{ label: 'Managed by LNU Health Services', icon: HospitalIcon },
{ label: 'Secure Student Records', icon: LockIcon }];


export const registrationSteps = [
{ title: 'Fill Out Your Health Record', text: 'Personal details, emergency contact, and health history. About 5 minutes.' },
{ title: 'Add Guardian Signature', text: "Upload a photo of your guardian's digital signature to confirm the information." },
{ title: 'Get Your QR Code', text: 'It appears right away. Save it and show it at the LNU Health Services Office.' }];


export const accessFlow = [
{ label: 'Register', icon: UserPlusIcon },
{ label: 'Get Your QR', icon: QrCodeIcon },
{ label: 'Clinic Scans', icon: ScanLineIcon },
{ label: 'Record Opens', icon: FileHeartIcon }];


export const trustItems = [
{ title: 'Official LNU Health Services System', text: 'Run by the university Health Services Office.', icon: BadgeCheckIcon },
{ title: 'QR-Based Emergency Access', text: 'One scan opens your record when you need care.', icon: QrCodeIcon },
{ title: 'Secure Student Health Records', text: 'Medical details are visible to clinic staff only.', icon: LockIcon },
{ title: 'University Managed', text: 'Maintained by Leyte Normal University.', icon: BuildingIcon }];


export const previewStudent = {
  name: 'Juan Dela Cruz',
  surname: 'Dela Cruz',
  initials: 'JD',
  age: 20,
  program: 'BLIS 3-A',
  studentNo: '0000000',
  bloodType: 'O+',
  allergy: 'Penicillin',
  emergency: 'Maria Dela Cruz · Mother',
  icon: GraduationCapIcon
};