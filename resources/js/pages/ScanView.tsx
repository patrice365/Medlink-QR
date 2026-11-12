import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { HomeIcon, LockIcon, PhoneCallIcon, QrCodeIcon, ShieldCheckIcon, ShieldIcon, StethoscopeIcon } from 'lucide-react';
import { useRecords } from '../contexts/RecordsContext';
import { usePublicPatient } from '../hooks/usePublicPatient';
import { emergencyContacts, emergencySteps } from '../data/emergencyContacts';
import { computeAge, fullName } from '../utils/patient';
import { BrandMark } from '../components/BrandMark';
import { ActionButton } from '../components/ActionButton';
import { InfoChip } from '../components/ui/InfoChip';

export function ScanView() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { role } = useRecords();
  const { patient, loading } = usePublicPatient(id);

  if (patient && role === 'clinic') return <Navigate to={`/clinic/records/${patient.id}`} replace />;

  if (loading) {
    return (
      <div className="grid min-h-screen w-full place-items-center bg-canvas text-ink-soft" role="status">
        Looking up this QR code…
      </div>);

  }

  return (
    <div className="min-h-screen w-full bg-canvas">
      <header className="bg-lnu-header pb-24 pt-5">
        <div className="mx-auto flex max-w-md justify-center px-5">
          <BrandMark inverted />
        </div>
      </header>
      <main className="mx-auto -mt-16 w-full max-w-md px-5 pb-10">
        {patient ?
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
            <InfoChip icon={ShieldCheckIcon}>Registered LNU student</InfoChip>
            <h1 className="mt-4 text-2xl font-semibold leading-tight text-brand-navy">{fullName(patient)}</h1>
            <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-line py-5">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Age</dt>
                <dd className="mt-1 text-xl font-semibold text-brand-navy">{computeAge(patient.dateOfBirth) ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Program</dt>
                <dd className="mt-1 text-xl font-semibold text-brand-navy">{patient.program || '—'}</dd>
              </div>
            </dl>
            <section aria-labelledby="help-title" className="mt-6">
              <h2 id="help-title" className="text-base font-semibold text-brand-navy">
                Does this student need help?
              </h2>
              <div className="mt-3 space-y-3">
                <a
                href={`tel:${emergencyContacts.clinic.number}`}
                className="flex min-h-[56px] items-center gap-3 rounded-xl bg-danger px-4 py-3 text-white transition-colors duration-150 hover:bg-danger-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/30">
                
                  <PhoneCallIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{emergencyContacts.clinic.label}</span>
                    <span className="block text-[13px] text-white/90">{emergencyContacts.clinic.hours}</span>
                  </span>
                  <span className="text-sm font-medium">{emergencyContacts.clinic.number}</span>
                </a>
                <a
                href={`tel:${emergencyContacts.security.number}`}
                className="flex min-h-[56px] items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-secondary-ink transition-colors duration-150 hover:bg-secondary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
                
                  <ShieldIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{emergencyContacts.security.label}</span>
                    <span className="block text-[13px]">{emergencyContacts.security.hours}</span>
                  </span>
                  <span className="text-sm font-medium">{emergencyContacts.security.number}</span>
                </a>
              </div>
              <ol className="mt-5 space-y-2.5">
                {emergencySteps.map((s, i) =>
              <li key={s} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-tint text-xs font-semibold text-brand-royal">
                      {i + 1}
                    </span>
                    {s}
                  </li>
              )}
              </ol>
            </section>
            <div className="mt-6 flex gap-3 rounded-xl bg-canvas p-4">
              <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-royal" aria-hidden="true" />
              <p className="text-[13px] leading-relaxed text-ink-soft">
                Medical information is private and visible only to LNU clinic staff.
              </p>
            </div>
            <div className="mt-4">
              <ActionButton
              variant="ghost"
              icon={StethoscopeIcon}
              fullWidth
              onClick={() => navigate(`/login?role=clinic&next=${encodeURIComponent(`/p/${patient.id}`)}`)}>
              
                Clinic staff sign in
              </ActionButton>
            </div>
          </div> :

        <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-card">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-tint text-brand-royal">
              <QrCodeIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-xl font-semibold text-brand-navy">This QR code isn't linked to a record</h1>
            <p className="mt-2 text-[15px] text-ink-soft">
              The code may be old or damaged. Ask the student to show their QR again from MedLink.
            </p>
            <div className="mt-6 flex justify-center">
              <ActionButton variant="secondary" icon={HomeIcon} onClick={() => navigate('/')}>
                Go to MedLink home
              </ActionButton>
            </div>
          </div>
        }
        <p className="mt-6 text-center font-serif text-sm font-semibold text-ink-soft">Leyte Normal University · Health Services Office</p>
      </main>
    </div>);

}