import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyholeIcon, QrCodeIcon, UserPlusIcon } from 'lucide-react';
import { usePublicPatient } from '../hooks/usePublicPatient';
import { LAST_REGISTERED_KEY } from '../utils/storage';
import { heroChips, registrationSteps, trustItems } from '../data/landing';
import { BrandMark, LNU_LOGO_URL } from '../components/BrandMark';
import { ActionButton } from '../components/ActionButton';
import { QrModal } from '../components/QrModal';
import { Eyebrow } from '../components/ui/Eyebrow';
import { InfoChip } from '../components/ui/InfoChip';
import { PhonePreview } from '../components/landing/PhonePreview';

const BACKGROUND_URL = "/Untitled-design-11.png";

export function Home() {
  const navigate = useNavigate();
  const [showQr, setShowQr] = useState(false);
  const [lastId] = useState(() => {
    try {
      return localStorage.getItem(LAST_REGISTERED_KEY);
    } catch {
      return null;
    }
  });
  // The last record registered on this device, loaded from the server's public endpoint.
  const { patient: lastPatient } = usePublicPatient(lastId);

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-canvas bg-cover bg-bottom bg-no-repeat md:bg-fixed"
      style={{ backgroundImage: `linear-gradient(rgba(247,248,252,0.55), rgba(247,248,252,0.55)), url(${BACKGROUND_URL})` }}>
      
      <header className="bg-lnu-header">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <BrandMark inverted />
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/40 bg-transparent px-4 text-sm font-medium text-white transition-[border-color,transform] duration-150 ease-out hover:-translate-y-px hover:border-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25">
            
            <LockKeyholeIcon className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            <span className="hidden sm:inline">Staff Portal</span>
            <span className="sr-only sm:hidden">Staff Portal</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-14 pt-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:pb-20 lg:pt-20">
          <section>
            <Eyebrow className="max-w-md">Emergency Health Information System</Eyebrow>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.15] tracking-tight text-brand-navy sm:text-[44px]">
              Your health record, one scan away in an emergency.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Register once on your phone or tablet. Receive a personal QR code that allows authorized LNU Health Services
              personnel to access your health information during emergencies.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionButton size="lg" icon={UserPlusIcon} onClick={() => navigate('/register')}>
                Register & Get My QR
              </ActionButton>
              {lastPatient &&
              <ActionButton size="lg" variant="secondary" icon={QrCodeIcon} onClick={() => setShowQr(true)}>
                  Show My QR Again
                </ActionButton>
              }
            </div>
            <ul className="mt-10 flex flex-wrap gap-2" aria-label="About MedLink QR">
              {heroChips.map((chip) =>
              <li key={chip.label}>
                  <InfoChip icon={chip.icon}>{chip.label}</InfoChip>
                </li>
              )}
            </ul>
          </section>

          <PhonePreview />
        </div>

        {/* Trust strip */}
        <section aria-label="System credentials" className="border-y border-line bg-white/80">
          <ul className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {trustItems.map((item) =>
            <li key={item.title} className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tint text-brand-royal">
                  <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </li>
            )}
          </ul>
        </section>

        {/* Registration process */}
        <div className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
          <section aria-labelledby="how-title" className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow className="max-w-xs">Registration</Eyebrow>
                <h2 id="how-title" className="mt-3 text-2xl font-semibold text-brand-navy">
                  How Registration Works
                </h2>
              </div>
              <p className="text-sm text-ink-soft">Takes about 5 minutes on your phone.</p>
            </div>
            <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
              {registrationSteps.map((step, index) =>
              <li key={step.title} className="relative flex gap-4 md:flex-col md:gap-5">
                  <div className="flex items-center gap-3 md:w-full">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-royal text-lg font-semibold text-white">
                      {index + 1}
                    </span>
                    {index < registrationSteps.length - 1 &&
                  <span className="hidden h-px flex-1 bg-line md:block" aria-hidden="true" />
                  }
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-brand-navy">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.text}</p>
                  </div>
                </li>
              )}
            </ol>
            <div className="mt-10 border-t border-line pt-6">
              <ActionButton icon={UserPlusIcon} onClick={() => navigate('/register')}>
                Start Registration
              </ActionButton>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5 text-sm">
          <img src={LNU_LOGO_URL} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
          <p className="font-serif font-semibold text-brand-navy">Leyte Normal University · Health Services Office</p>
        </div>
      </footer>

      <QrModal patient={lastPatient} open={showQr} onClose={() => setShowQr(false)} variant="staff" />
    </div>);

}