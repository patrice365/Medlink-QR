import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ClinicalRecord, PatientRecord } from '../types/patient';
import type { StaffLevel, StaffRole, StaffSession } from '../types/auth';
import type { VisitRecord } from '../types/visit';
import { ApiError, api, getToken, setToken } from '../lib/api';
import { hydrateSeed } from '../utils/patient';
import { hydrateVisit } from '../utils/visit';
import { SESSION_KEY, loadJson, saveJson } from '../utils/storage';

interface RecordsContextValue {
  /** All patient records. Empty until a staff member signs in. */
  patients: PatientRecord[];
  visits: VisitRecord[];
  /** True while records are being loaded from the server after sign-in. */
  loading: boolean;
  role: StaffRole | null;
  level: StaffLevel | null;
  canEditVisits: boolean;
  /** Resolves to false when the PIN is wrong. Throws on other errors (e.g. server down). */
  signIn: (pin: string) => Promise<boolean>;
  signOut: () => void;
  getPatient: (id: string) => PatientRecord | undefined;
  addPatient: (record: PatientRecord) => Promise<PatientRecord>;
  updatePatient: (record: PatientRecord) => Promise<void>;
  addVisit: (patientId: string, clinical: ClinicalRecord) => Promise<VisitRecord>;
  updateVisit: (visit: VisitRecord) => Promise<void>;
}

interface LoginResponse {
  token: string;
  session: StaffSession;
}

const RecordsContext = createContext<RecordsContextValue | null>(null);

function storedSession(): StaffSession | null {
  const stored = loadJson<StaffSession | null>(sessionStorage, SESSION_KEY, null);
  return stored && stored.role === 'clinic' && getToken() ? stored : null;
}

export function RecordsProvider({ children }: {children: React.ReactNode;}) {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [session, setSession] = useState<StaffSession | null>(storedSession);
  const [loading, setLoading] = useState(() => storedSession() !== null);

  useEffect(() => saveJson(sessionStorage, SESSION_KEY, session), [session]);

  const clearSession = useCallback(() => {
    setToken(null);
    setSession(null);
    setPatients([]);
    setVisits([]);
  }, []);

  /** Runs a staff API call; if the token has expired, signs out so the login page shows. */
  const staffCall = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      try {
        return await fn();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) clearSession();
        throw e;
      }
    },
    [clearSession]
  );

  // Load every record once a staff member is signed in.
  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    staffCall(() => Promise.all([api<PatientRecord[]>('/patients'), api<VisitRecord[]>('/visits')])).
    then(([p, v]) => {
      if (cancelled) return;
      setPatients(p.map(hydrateSeed));
      setVisits(v.map(hydrateVisit));
    }).
    catch((e) => console.error('Could not load records', e)).
    finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [session, staffCall]);

  const signIn = useCallback(async (pin: string) => {
    try {
      const res = await api<LoginResponse>('/login', { method: 'POST', body: { pin: pin.trim() }, auth: false });
      setToken(res.token);
      setSession({ role: res.session.role, level: res.session.level });
      return true;
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 422)) return false;
      throw e;
    }
  }, []);

  const signOut = useCallback(() => {
    // Revoke the token on the server; sign out locally either way.
    api('/logout', { method: 'POST' }).catch(() => undefined);
    clearSession();
  }, [clearSession]);

  const getPatient = useCallback(
    (id: string) => patients.find((p) => p.id.toUpperCase() === id.toUpperCase()),
    [patients]
  );

  /** Public registration. The server assigns the ID, clinic number and registration time. */
  const addPatient = useCallback(
    async (record: PatientRecord) => {
      const created = hydrateSeed(await api<PatientRecord>('/patients', { method: 'POST', body: record, auth: false }));
      if (session) setPatients((prev) => [created, ...prev]);
      return created;
    },
    [session]
  );

  const updatePatient = useCallback(
    async (record: PatientRecord) => {
      await staffCall(() => api<PatientRecord>(`/patients/${encodeURIComponent(record.id)}`, { method: 'PUT', body: record }));
      // Keep the exact object that was saved so edit screens see no unsaved changes.
      setPatients((prev) => prev.map((p) => p.id === record.id ? record : p));
    },
    [staffCall]
  );

  const addVisit = useCallback(
    async (patientId: string, clinical: ClinicalRecord) => {
      const saved = await staffCall(() =>
      api<VisitRecord>(`/patients/${encodeURIComponent(patientId)}/visits`, { method: 'POST', body: { clinical } })
      );
      const visit = hydrateVisit(saved);
      setVisits((prev) => [visit, ...prev]);
      return visit;
    },
    [staffCall]
  );

  /** Physician only. The server records who amended it and when. */
  const updateVisit = useCallback(
    async (visit: VisitRecord) => {
      const saved = await staffCall(() =>
      api<VisitRecord>(`/visits/${encodeURIComponent(visit.id)}`, {
        method: 'PUT',
        body: { clinical: visit.clinical, status: visit.status }
      })
      );
      const updated = hydrateVisit(saved);
      setVisits((prev) => prev.map((v) => v.id === updated.id ? updated : v));
    },
    [staffCall]
  );

  const value = useMemo(
    () => ({
      patients,
      visits,
      loading,
      role: session?.role ?? null,
      level: session?.level ?? null,
      canEditVisits: session?.level === 'physician',
      signIn,
      signOut,
      getPatient,
      addPatient,
      updatePatient,
      addVisit,
      updateVisit
    }),
    [patients, visits, loading, session, signIn, signOut, getPatient, addPatient, updatePatient, addVisit, updateVisit]
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecords(): RecordsContextValue {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error('useRecords must be used inside RecordsProvider');
  return ctx;
}
