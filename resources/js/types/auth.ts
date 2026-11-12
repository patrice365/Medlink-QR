export type StaffRole = 'clinic';
export type StaffLevel = 'staff' | 'physician';

export interface StaffSession {
  role: StaffRole;
  level: StaffLevel;
}