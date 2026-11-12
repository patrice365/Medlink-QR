import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { DownloadIcon, EyeIcon, HashIcon, LockIcon, UserPlusIcon } from 'lucide-react';
import type { PatientRecord } from '../types/patient';
import { fullName } from '../utils/patient';
import { scanUrl } from '../utils/storage';
import { Modal } from './Modal';
import { ActionButton } from './ActionButton';
import { InfoChip } from './ui/InfoChip';

interface QrModalProps {
  patient: PatientRecord | null;
  open: boolean;
  onClose: () => void;
  variant?: 'registration' | 'staff';
  onRegisterAnother?: () => void;
}

export function QrModal({ patient, open, onClose, variant = 'staff', onRegisterAnother }: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const download = () => {
    if (!patient || !canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `MedLink-QR-${patient.surname.replace(/\s+/g, '')}-${patient.id}.png`;
    link.click();
  };

  return (
    <Modal
      open={open && Boolean(patient)}
      onClose={onClose}
      title={variant === 'registration' ? 'Registration complete' : 'Patient QR code'}
      description={
      variant === 'registration' ?
      'Save this QR code and present it at the LNU Health Service Office (Clinic Office).' :
      'Print or send this code to the student.'
      }>
      
      {patient &&
      <div className="space-y-6">
          <div className="rounded-2xl bg-canvas p-6 text-center">
            <div className="mx-auto w-fit rounded-2xl border border-line bg-white p-4 shadow-card">
              <QRCodeCanvas
              ref={canvasRef}
              value={scanUrl(patient.id)}
              size={208}
              level="M"
              marginSize={1}
              fgColor="#0A0A5C"
              bgColor="#FFFFFF"
              aria-label={`QR code for ${fullName(patient)}`} />
            
            </div>
            <p className="mt-5 text-lg font-semibold text-brand-navy">{patient.surname}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <InfoChip icon={HashIcon}>Clinic no. {patient.clinicNo}</InfoChip>
              <InfoChip tone="gold">{patient.id}</InfoChip>
            </div>
          </div>

          <p className="flex gap-2.5 rounded-xl border border-line p-4 text-sm leading-relaxed text-ink-soft">
            <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-royal" aria-hidden="true" />
            <span>
              Only clinic staff see the full health record. Anyone else who scans sees just the name, age, and program.
            </span>
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <ActionButton icon={DownloadIcon} onClick={download} fullWidth>
              Save QR image
            </ActionButton>
            <ActionButton
            variant="secondary"
            icon={EyeIcon}
            fullWidth
            onClick={() => {
              onClose();
              navigate(`/p/${patient.id}`);
            }}>
            
              Public view
            </ActionButton>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-between">
            {onRegisterAnother ?
          <ActionButton variant="ghost" icon={UserPlusIcon} onClick={onRegisterAnother}>
                Register another student
              </ActionButton> :

          <span />
          }
            <ActionButton variant="outline" onClick={onClose}>
              Done
            </ActionButton>
          </div>
        </div>
      }
    </Modal>);

}