import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GraduationCapIcon, HashIcon, PhoneIcon, QrCodeIcon, TriangleAlertIcon, UserIcon } from 'lucide-react';
import type { PatientRecord } from '../types/patient';
import { computeAge, fullName } from '../utils/patient';
import { scanUrl } from '../utils/storage';
import { PatientAvatar } from './PatientAvatar';
import { ActionButton } from './ActionButton';
import { InfoChip } from './ui/InfoChip';

interface RecordSidebarProps {
  patient: PatientRecord;
  onShowQr: () => void;
}

export function RecordSidebar({ patient, onShowQr }: RecordSidebarProps) {
  const age = computeAge(patient.dateOfBirth);
  const conditions = Object.keys(patient.pastHistory);

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center gap-4 xl:flex-col xl:items-start">
          <PatientAvatar patient={patient} size="xl" />
          <div className="min-w-0">
            <h1 className="text-xl font-semibold leading-tight text-brand-navy">{fullName(patient)}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <InfoChip icon={HashIcon}>{patient.clinicNo}</InfoChip>
              <InfoChip icon={GraduationCapIcon}>{patient.program || '—'}</InfoChip>
              <InfoChip icon={UserIcon}>
                {age ?? '—'} yrs · {patient.sex || '—'}
              </InfoChip>
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Mobile</dt>
            <dd className="mt-1 text-[15px] text-ink">{patient.contactNo || '—'}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Emergency contact</dt>
            <dd className="mt-1 text-[15px] text-ink">
              {patient.emergencyName} {patient.emergencyRelation && <span className="text-ink-soft">({patient.emergencyRelation})</span>}
            </dd>
            <dd>
              <a href={`tel:${patient.emergencyContact}`} className="inline-flex items-center gap-1.5 font-medium text-brand-royal hover:underline">
                <PhoneIcon className="h-3.5 w-3.5" aria-hidden="true" /> {patient.emergencyContact}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      {patient.consentSignature &&
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Guardian's digital signature</p>
          <img
          src={patient.consentSignature}
          alt={`Signature of ${patient.consentName || fullName(patient)}`}
          className="mt-3 h-20 w-full rounded-lg border border-line object-contain" />
        
          <p className="mt-2 text-sm text-ink">{patient.consentName || fullName(patient)}</p>
          {patient.consentDate && <p className="text-xs text-ink-soft">Signed {patient.consentDate}</p>}
        </div>
      }

      {(patient.allergy || conditions.length > 0) &&
      <div className="rounded-2xl border border-danger/30 bg-danger-soft p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-danger-strong">
            <TriangleAlertIcon className="h-4 w-4" aria-hidden="true" /> Health alerts
          </h2>
          {patient.allergy &&
        <p className="mt-2 text-sm text-ink">
              <span className="font-medium">Allergy:</span> {patient.allergy}
            </p>
        }
          {conditions.length > 0 &&
        <p className="mt-1.5 text-sm text-ink">
              <span className="font-medium">History:</span> {conditions.join(', ')}
            </p>
        }
        </div>
      }

      <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-line bg-white p-2">
            <QRCodeSVG value={scanUrl(patient.id)} size={64} fgColor="#0A0A5C" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Record ID</p>
            <p className="mt-1 truncate font-semibold text-brand-navy">{patient.id}</p>
          </div>
        </div>
        <div className="mt-4">
          <ActionButton variant="secondary" icon={QrCodeIcon} fullWidth onClick={onShowQr}>
            Show QR code
          </ActionButton>
        </div>
      </div>
    </aside>);

}