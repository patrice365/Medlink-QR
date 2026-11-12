import React, { useEffect, useId, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CameraOffIcon, Loader2Icon } from 'lucide-react';
import { Modal } from './Modal';
import { ActionButton } from './ActionButton';

interface QrScannerModalProps {
  open: boolean;
  onClose: () => void;
  onDetected: (text: string) => void;
}

export function QrScannerModal({ open, onClose, onDetected }: QrScannerModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Scan Student QR Code"
      description="Point the camera at the student's MedLink QR code. The record opens automatically.">
      
      {open && <ScannerView onDetected={onDetected} onClose={onClose} />}
    </Modal>);

}

function ScannerView({ onDetected, onClose }: {onDetected: (text: string) => void;onClose: () => void;}) {
  const regionId = `qr-region-${useId().replace(/:/g, '')}`;
  const [status, setStatus] = useState<'starting' | 'scanning' | 'error'>('starting');
  const doneRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(regionId, { verbose: false });
    let cancelled = false;

    const stop = async () => {
      try {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
      } catch {

        /* camera already released */}
    };

    scanner.
    start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
      (text) => {
        if (doneRef.current) return;
        doneRef.current = true;
        stop().then(() => onDetected(text));
      },
      () => undefined
    ).
    then(() => {
      if (cancelled) stop();else
      setStatus('scanning');
    }).
    catch(() => !cancelled && setStatus('error'));

    return () => {
      cancelled = true;
      stop();
    };
  }, [regionId, onDetected]);

  return (
    <div className="space-y-5">
      <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-line bg-brand-navy">
        <div id={regionId} className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
        {status === 'starting' &&
        <div className="absolute inset-0 grid place-items-center text-sm text-white">
            <span className="flex items-center gap-2">
              <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> Starting camera…
            </span>
          </div>
        }
        {status === 'error' &&
        <div className="absolute inset-0 grid place-items-center bg-canvas p-6 text-center">
            <div>
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger-strong">
                <CameraOffIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-3 font-semibold text-brand-navy">Camera unavailable</p>
              <p className="mt-1 text-[13px] text-ink-soft">
                Allow camera access in your browser, or type the record ID in the box instead.
              </p>
            </div>
          </div>
        }
      </div>
      <p className="text-center text-[13px] text-ink-soft" role="status">
        {status === 'scanning' ? 'Looking for a QR code…' : status === 'starting' ? 'Requesting camera access…' : ''}
      </p>
      <div className="flex justify-end border-t border-line pt-5">
        <ActionButton variant="outline" onClick={onClose}>
          Cancel
        </ActionButton>
      </div>
    </div>);

}