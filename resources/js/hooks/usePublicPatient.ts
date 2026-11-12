import { useEffect, useState } from 'react';
import type { PatientRecord } from '../types/patient';
import { api } from '../lib/api';
import { hydrateSeed } from '../utils/patient';

/** Public fields returned by GET /api/public/patients/{id}. */
type PublicPatient = Pick<PatientRecord, 'id' | 'clinicNo' | 'surname' | 'firstName' | 'middleName' | 'dateOfBirth' | 'program'>;

/**
 * Loads the small public part of a record (name, birth date, program) without signing in.
 * Fields not shared publicly are left empty.
 */
export function usePublicPatient(id: string | null | undefined) {
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      setPatient(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api<PublicPatient>(`/public/patients/${encodeURIComponent(id)}`, { auth: false }).
    then((p) => !cancelled && setPatient(hydrateSeed(p))).
    catch(() => !cancelled && setPatient(null)).
    finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { patient, loading };
}
