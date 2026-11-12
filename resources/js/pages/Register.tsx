import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeftIcon, ArrowRightIcon, CircleAlertIcon, CloudCheckIcon, HistoryIcon, QrCodeIcon } from 'lucide-react';
import type { FieldErrors, PatientRecord, PatientUpdate } from '../types/patient';
import { REGISTRATION_STEPS } from '../data/formOptions';
import { useRecords } from '../contexts/RecordsContext';
import { emptyPatient, fullName, todayIso } from '../utils/patient';
import { validateStep } from '../utils/validation';
import { LAST_REGISTERED_KEY, REGISTRATION_DRAFT_KEY, loadJson, saveJson } from '../utils/storage';

interface RegistrationDraft {
  step: number;
  data: PatientRecord;
  savedAt: string;
}
import { BrandMark } from '../components/BrandMark';
import { ActionButton } from '../components/ActionButton';
import { RegistrationStepper } from '../components/RegistrationStepper';
import { QrModal } from '../components/QrModal';
import { PersonalSection } from '../components/patient-form/PersonalSection';
import { SchoolContactSection } from '../components/patient-form/SchoolContactSection';
import { HealthHistorySection } from '../components/patient-form/HealthHistorySection';
import { LifestyleSection } from '../components/patient-form/LifestyleSection';
import { RegistrationReview } from '../components/patient-form/RegistrationReview';

export function Register() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { addPatient } = useRecords();
  const [savedDraft] = useState(() => loadJson<RegistrationDraft | null>(localStorage, REGISTRATION_DRAFT_KEY, null));
  const [step, setStep] = useState(savedDraft?.step ?? 0);
  const [data, setData] = useState<PatientRecord>(() => savedDraft ? { ...emptyPatient(), ...savedDraft.data } : emptyPatient());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<PatientRecord | null>(null);
  const [showRestored, setShowRestored] = useState(Boolean(savedDraft));
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (created) return;
    const t = window.setTimeout(() => saveJson(localStorage, REGISTRATION_DRAFT_KEY, { step, data, savedAt: new Date().toISOString() }), 400);
    return () => window.clearTimeout(t);
  }, [step, data, created]);

  const errorMessages = Object.values(errors).filter((m): m is string => Boolean(m));

  const isLast = step === REGISTRATION_STEPS.length - 1;

  const update: PatientUpdate = useCallback((patch) => {
    setData((d) => ({ ...d, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      (Object.keys(patch) as (keyof PatientRecord)[]).forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const goTo = (index: number) => {
    setStep(index);
    setErrors({});
    window.scrollTo({ top: 0 });
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const record = await addPatient({
        ...data,
        program: data.program.trim(),
        consentName: data.consentName.trim() || fullName(data),
        consentDate: data.consentDate || todayIso()
      });
      localStorage.setItem(LAST_REGISTERED_KEY, record.id);
      localStorage.removeItem(REGISTRATION_DRAFT_KEY);
      setCreated(record);
    } catch (err) {
      // The draft stays saved on this device, so the student can try again.
      toast.error(err instanceof Error ? err.message : 'Could not save your record. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    const found = validateStep(step, data, agreed);
    if (Object.keys(found).length) {
      setErrors(found);
      window.requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({ block: 'center' });
        errorRef.current?.focus();
      });
      return;
    }
    if (isLast) submit();else
    goTo(step + 1);
  };

  const reset = () => {
    localStorage.removeItem(REGISTRATION_DRAFT_KEY);
    setCreated(null);
    setData(emptyPatient());
    setAgreed(false);
    setShowRestored(false);
    goTo(0);
  };

  const startOver = () => {
    reset();
    toast.success('Started a new registration');
  };

  const current = REGISTRATION_STEPS[step];

  return (
    <div className="min-h-screen w-full bg-canvas">
      <header className="bg-lnu-header">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20">
            
            <BrandMark inverted />
          </button>
          <span className="hidden text-sm font-medium text-white/80 sm:block">Patient Health Record</span>
        </div>
      </header>
      <div className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <RegistrationStepper steps={REGISTRATION_STEPS} current={step} onSelect={goTo} />
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-44 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Patient Health Record · F-HSO-001</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand-navy">{current.title}</h1>
        <p className="mt-1 text-[15px] text-ink-soft">{current.description}</p>
        {!isLast &&
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-tint px-3 py-1 text-[13px] font-medium text-brand-navy">
            <span className="text-danger">*</span> All fields are required. Type <strong className="font-semibold">N/A</strong> if a question doesn't apply.
          </p>
        }

        {showRestored &&
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-line bg-tint px-4 py-3 sm:flex-row sm:items-center">
            <HistoryIcon className="hidden h-5 w-5 shrink-0 text-brand-royal sm:block" aria-hidden="true" />
            <p className="flex-1 text-sm text-ink">
              <strong className="font-semibold">Welcome back.</strong> We kept your answers so you can continue where you left off.
            </p>
            <div className="flex gap-2">
              <button
              type="button"
              onClick={startOver}
              className="h-11 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors duration-150 hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
              
                Start over
              </button>
              <button
              type="button"
              onClick={() => setShowRestored(false)}
              className="h-11 rounded-lg bg-white px-4 text-sm font-medium text-brand-royal ring-1 ring-line transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
              
                Continue
              </button>
            </div>
          </div>
        }

        {errorMessages.length > 0 &&
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 focus:outline-none">
          
            <p className="flex items-center gap-2 text-sm font-semibold text-danger-strong">
              <CircleAlertIcon className="h-4 w-4" aria-hidden="true" />
              {errorMessages.length === 1 ? '1 thing needs your attention' : `${errorMessages.length} things need your attention`}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-9 text-sm text-danger-strong">
              {errorMessages.map((m, i) =>
            <li key={`${i}-${m}`}>{m}</li>
            )}
            </ul>
          </div>
        }

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
            
            {step === 0 && <PersonalSection data={data} update={update} errors={errors} />}
            {step === 1 && <SchoolContactSection data={data} update={update} errors={errors} />}
            {step === 2 && <HealthHistorySection data={data} update={update} errors={errors} />}
            {step === 3 && <LifestyleSection data={data} update={update} errors={errors} />}
            {step === 4 &&
            <RegistrationReview
              data={data}
              update={update}
              agreed={agreed}
              onAgreeChange={(v) => {
                setAgreed(v);
                setErrors((prev) => ({ ...prev, agreement: undefined }));
              }}
              onEdit={goTo}
              error={errors.agreement}
              nameError={errors.consentName}
              signatureError={errors.consentSignature} />

            }
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white">
        <p className="mx-auto flex max-w-3xl items-center gap-1.5 px-4 pt-3 text-xs text-ink-soft">
          <CloudCheckIcon className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          Your answers are saved on this device as you type.
        </p>
        <div className="mx-auto flex max-w-3xl gap-3 px-4 pb-6 pt-3">
          {step > 0 &&
          <ActionButton variant="secondary" icon={ArrowLeftIcon} onClick={() => goTo(step - 1)} disabled={submitting}>
              Back
            </ActionButton>
          }
          <ActionButton
            icon={isLast ? QrCodeIcon : ArrowRightIcon}
            loading={submitting}
            onClick={handleNext}
            className="flex-1">
            
            {submitting ? 'Saving your record…' : isLast ? 'Submit & get my QR' : 'Continue'}
          </ActionButton>
        </div>
      </footer>

      <QrModal
        patient={created}
        open={Boolean(created)}
        variant="registration"
        onClose={() => navigate('/')}
        onRegisterAnother={reset} />
      
    </div>);

}