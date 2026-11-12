import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AlertTriangleIcon, LockIcon, PhoneIcon, ScanLineIcon } from 'lucide-react';
import { accessFlow, previewStudent } from '../../data/landing';

export function PhonePreview() {
  return (
    <figure
      aria-label="Example of a MedLink QR code on a phone and the health record the clinic sees after scanning"
      className="mx-auto w-full max-w-[560px] rounded-[24px] border border-line bg-white p-4 shadow-card sm:p-6">
      
      {/* Stage */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-tint px-4 py-8 sm:flex-row sm:gap-0 sm:px-6 sm:py-10">
        {/* Student's phone */}
        <div className="w-[200px] shrink-0 rounded-[30px] border border-line bg-white p-2 shadow-card">
          <div className="rounded-[24px] bg-canvas px-4 pb-5 pt-2.5">
            <div className="mx-auto h-1 w-12 rounded-full bg-line" aria-hidden="true" />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">My MedLink QR</p>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
            </div>
            <div className="mt-3 rounded-xl border border-line bg-white p-3">
              <QRCodeSVG
                value="https://medlink.lnu.edu.ph/p/sample"
                size={148}
                fgColor="#0A0A5C"
                className="h-auto w-full"
                aria-hidden="true" />
              
            </div>
            <p className="mt-3 text-center text-[15px] font-semibold text-brand-navy">{previewStudent.surname}</p>
            <p className="text-center text-[11px] text-ink-soft">{previewStudent.program}</p>
          </div>
        </div>

        {/* Scan connector */}
        <div className="flex shrink-0 flex-col items-center sm:flex-row" aria-hidden="true">
          <span className="h-4 w-px border-l border-dashed border-brand-royal/40 sm:h-px sm:w-5 sm:border-l-0 sm:border-t" />
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-royal text-white ring-4 ring-white">
            <ScanLineIcon className="h-[18px] w-[18px]" />
          </span>
          <span className="h-4 w-px border-l border-dashed border-brand-royal/40 sm:h-px sm:w-5 sm:border-l-0 sm:border-t" />
        </div>

        {/* What the clinic sees */}
        <div className="w-full max-w-[240px] shrink-0 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line bg-brand-navy px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white">Clinic View</p>
            <LockIcon className="h-3 w-3 text-brand-gold" aria-hidden="true" />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tint text-sm font-semibold text-brand-royal">
                {previewStudent.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-brand-navy">{previewStudent.name}</p>
                <p className="text-[11px] text-ink-soft">
                  {previewStudent.age} yrs · {previewStudent.program}
                </p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-canvas px-2.5 py-2">
                <dt className="text-ink-soft">Student No.</dt>
                <dd className="mt-0.5 font-semibold text-ink">{previewStudent.studentNo}</dd>
              </div>
              <div className="rounded-lg bg-canvas px-2.5 py-2">
                <dt className="text-ink-soft">Blood Type</dt>
                <dd className="mt-0.5 font-semibold text-ink">{previewStudent.bloodType}</dd>
              </div>
            </dl>

            <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-danger-soft px-2.5 py-2 text-[11px] font-medium text-danger-strong">
              <AlertTriangleIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
              Allergy: {previewStudent.allergy}
            </p>
            <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-tint px-2.5 py-2 text-[11px] text-brand-navy">
              <PhoneIcon className="h-3 w-3 shrink-0 text-brand-royal" aria-hidden="true" />
              <span className="truncate">{previewStudent.emergency}</span>
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <figcaption className="mt-6">
        <ol className="grid grid-cols-2 gap-y-5 sm:grid-cols-4">
          {accessFlow.map((step, i) =>
          <li key={step.label} className="relative flex flex-col items-center text-center">
              {i < accessFlow.length - 1 &&
            <span
              className="absolute left-[calc(50%+26px)] right-[calc(-50%+26px)] top-5 hidden h-px bg-line sm:block"
              aria-hidden="true" />

            }
              <span
              className={`grid h-10 w-10 place-items-center rounded-full ${
              i === accessFlow.length - 1 ? 'bg-brand-royal text-white' : 'bg-tint text-brand-royal'}`
              }>
              
                <step.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Step {i + 1}</span>
              <span className="whitespace-nowrap text-[13px] font-semibold text-brand-navy">{step.label}</span>
            </li>
          )}
        </ol>
      </figcaption>
    </figure>);

}