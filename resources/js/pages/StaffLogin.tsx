import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, KeyRoundIcon } from 'lucide-react';
import { useRecords } from '../contexts/RecordsContext';
import { BrandMark } from '../components/BrandMark';
import { ActionButton } from '../components/ActionButton';
import { TextField } from '../components/forms/TextField';

export function StaffLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { signIn } = useRecords();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    let ok = false;
    try {
      ok = await signIn(pin);
      if (!ok) setError('That PIN is not correct');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Try again.');
    } finally {
      setBusy(false);
    }
    if (!ok) return;
    const next = params.get('next');
    navigate(next && next.startsWith('/') ? next : '/clinic', { replace: true });
  };

  return (
    <div className="grid min-h-screen w-full bg-canvas lg:grid-cols-[1fr_1.1fr]">
      <section className="hidden flex-col justify-between bg-brand-navy p-12 lg:flex">
        <BrandMark inverted />
        <div>
          <p className="font-serif text-3xl font-bold tracking-wide text-brand-gold">Leyte Normal University</p>
          <h1 className="mt-4 max-w-md text-3xl font-semibold leading-tight text-white">
            The right information, for the right people, at the right moment.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            Clinic staff sign-in unlocks full student health records, visit notes, and AI-assisted triage.
          </p>
        </div>
        <p className="text-sm text-white/60">Health Services Office · Tacloban City</p>
      </section>

      <section className="flex flex-col px-5 py-6 sm:px-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex h-10 w-fit items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors duration-150 hover:bg-tint hover:text-brand-royal">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> Home
        </button>

        <form onSubmit={submit} className="mx-auto my-auto w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
          <div className="lg:hidden">
            <BrandMark />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-brand-navy lg:mt-0">Clinic staff sign in</h2>
          <p className="mt-1 text-[15px] text-ink-soft">LNU Health Services Office</p>

          <div className="mt-8">
            <TextField
              label="PIN"
              required
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              value={pin}
              error={error}
              onChange={(v) => {
                setPin(v);
                setError('');
              }} />
            
          </div>

          <ActionButton type="submit" icon={KeyRoundIcon} fullWidth className="mt-6" loading={busy}>
            Sign in
          </ActionButton>

          <p className="mt-5 rounded-lg bg-canvas px-3 py-2.5 text-center text-[13px] text-ink-soft">
            Demo PINs · Clinic staff <strong className="font-semibold text-brand-navy">1234</strong> · Head physician (can
            edit visit records) <strong className="font-semibold text-brand-navy">4321</strong>
          </p>
        </form>
      </section>
    </div>);

}