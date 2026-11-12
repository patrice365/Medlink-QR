export const PATIENTS_KEY = 'medlink.patients.v2';
export const VISITS_KEY = 'medlink.visits.v1';
export const SESSION_KEY = 'medlink.session.v2';
export const LAST_REGISTERED_KEY = 'medlink.lastRegistered';
export const REGISTRATION_DRAFT_KEY = 'medlink.registrationDraft.v1';

export function loadJson<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {

    // Storage full or unavailable — data stays in memory for this session.
  }}

export function scanUrl(id: string): string {
  return `${window.location.origin}/p/${id}`;
}