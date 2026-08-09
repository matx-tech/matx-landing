'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AlertCircle, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EVENTS, track } from '@/lib/analytics';
import { REGISTRATION_COPY } from '@/lib/content/landing-copy';
import { dialogExitMs } from '@/lib/dialog-timing';

const roles = [
  'Koolijuht / Direktor',
  'Õppejuht / Õppealajuhataja',
  'Matemaatikaõpetaja',
  'Muu haridustöötaja',
];

interface FormData {
  schoolName: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  classGroups: string;
  otherRole: string;
}

interface FormErrors {
  schoolName?: string;
  contactName?: string;
  role?: string;
  email?: string;
  phone?: string;
  classGroups?: string;
  otherRole?: string;
  consent?: string;
}

const STORAGE_KEY = 'matx-registration-draft';

// Single source for the validated fields — shared by validateForm and handleSubmit.
const FORM_FIELDS = ['schoolName', 'contactName', 'role', 'email', 'phone', 'classGroups'] as const;

/** Base fields plus the free-text role when 'Muu haridustöötaja' is picked. */
const fieldsForRole = (role: string) =>
  role === 'Muu haridustöötaja' ? [...FORM_FIELDS, 'otherRole'] : FORM_FIELDS;

const initialFormData: FormData = {
  schoolName: '',
  contactName: '',
  role: '',
  email: '',
  phone: '',
  classGroups: '',
  otherRole: '',
};

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Renders a school pilot-program registration dialog with draft persistence, validation, submission, and success feedback.
 *
 * @param isOpen - Whether the dialog is open
 * @param onClose - Called when the dialog closes
 */
export function RegistrationForm({ isOpen, onClose }: RegistrationFormProps) {
  const [consent, setConsent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [announcement, setAnnouncement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Visible submit failure (RISK-004): the sr-only live region announces the
  // error to screen readers, but sighted users need an on-screen message too.
  const [submitError, setSubmitError] = useState(false);
  // Draft initialization gate: the save effect must not run against the empty
  // initial state before the load effect has rehydrated the stored draft,
  // or it would delete the draft it is about to load.
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as FormData;
          if (parsed.schoolName || parsed.contactName || parsed.email) {
            setFormData(parsed);
          }
        } catch {
          // Invalid stored data, ignore
        }
      }
    }
    setHasLoadedDraft(true);
  }, []);

  // Save draft to localStorage on form data change. Save only when the user
  // has typed something; clearing the last field removes the draft instead of
  // writing an empty one (a new object ref makes a ref comparison useless).
  // Skipped until the stored draft has been loaded (see hasLoadedDraft).
  useEffect(() => {
    if (typeof window === 'undefined' || !hasLoadedDraft) return;
    if (Object.values(formData).some((value) => value !== '')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [formData, hasLoadedDraft]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      switch (name) {
        case 'schoolName':
          if (!value.trim()) return 'Kooli nimi on kohustuslik';
          if (value.trim().length < 3) return 'Kooli nimi peab olema vähemalt 3 tähemärki';
          break;
        case 'contactName':
          if (!value.trim()) return 'Kontaktisiku nimi on kohustuslik';
          if (value.trim().length < 2) return 'Nimi peab olema vähemalt 2 tähemärki';
          break;
        case 'role':
          if (!value.trim()) return 'Roll on kohustuslik';
          break;
        case 'otherRole':
          if (formData.role === 'Muu haridustöötaja' && !value.trim()) {
            return 'Täpsustage oma roll';
          }
          break;
        case 'email':
          if (!value.trim()) return 'E-post on kohustuslik';
          if (!/^[^\s@|]+@[^\s@|]+\.[^\s@|]+$/.test(value))
            return 'Sisestage kehtiv e-posti aadress';
          break;
        case 'phone':
          if (!value.trim()) return 'Telefoninumber on kohustuslik';
          if (!/^[+\d][\d\s-]{6,}$/.test(value.replace(/\s/g, ''))) {
            return 'Sisestage kehtiv telefoninumber';
          }
          break;
        case 'classGroups':
          if (!value.trim()) return 'Klassirühmade arv on kohustuslik';
          break;
      }
      return undefined;
    },
    [formData.role],
  );

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    const fields = fieldsForRole(formData.role);

    fields.forEach((field) => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) newErrors[field as keyof FormErrors] = error;
    });

    if (!consent) newErrors.consent = 'Registreerimiseks on vajalik nõusolek';

    setErrors(newErrors);
    return newErrors;
  }, [formData, validateField, consent]);

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => new Set(prev).add(name));
      const error = validateField(name, formData[name as keyof FormData]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [formData, validateField],
  );

  const handleChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Re-validate on change if already touched
      if (touched.has(name)) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      setTouched(new Set(fieldsForRole(formData.role)));

      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setAnnouncement('Palun parandage vormi vead enne saatmist');
        // Move focus to the first invalid field so keyboard/screen-reader
        // users land on the error instead of hunting for it. Focus from the
        // freshly computed errors, not from aria-invalid in the DOM — the
        // error state has not rendered yet on the first submit.
        const firstInvalid =
          fieldsForRole(formData.role).find((field) => newErrors[field as keyof FormErrors]) ??
          'consent';
        document.getElementById(firstInvalid)?.focus();
        return;
      }

      if (isSubmitting) return;
      setIsSubmitting(true);
      setSubmitError(false);
      try {
        const res = await fetch('/api/registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, consent }),
        });
        if (!res.ok) throw new Error(`registration failed: ${res.status}`);
        clearDraft();
        setIsSuccess(true);
        track(EVENTS.pilotSignup, { role: formData.role });
        setAnnouncement(REGISTRATION_COPY.announcementSuccess);
      } catch {
        // Draft stays in localStorage, so a retry never loses the visitor's data.
        setAnnouncement(REGISTRATION_COPY.announcementError);
        setSubmitError(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, isSubmitting, clearDraft, consent],
  );

  const handleClose = useCallback(() => {
    setIsSuccess(false);
    setErrors({});
    setTouched(new Set());
    setSubmitError(false);
    onClose();
  }, [onClose]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      // Draft is kept in localStorage on purpose — an accidental close (or
      // refresh) must not lose the visitor's data. Explicit "Sulge" on the
      // success screen clears it via handleClearAndClose.
      if (!open) handleClose();
    },
    [handleClose],
  );

  const handleClearAndClose = useCallback(() => {
    setFormData(initialFormData);
    clearDraft();
    handleClose();
  }, [clearDraft, handleClose]);

  const inputClassName = (hasError: boolean): string =>
    `w-full px-4 py-3 rounded-lg bg-surface border text-text-primary placeholder:text-text-secondary/50 focus-ring-target transition-colors ${
      hasError
        ? 'border-red-600 dark:border-red-400 focus:border-red-600 dark:focus:border-red-400'
        : 'border-border'
    }`;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{ animationDuration: `${dialogExitMs}ms` }}
          className='fixed inset-0 z-50 bg-canvas/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
        />
        <Dialog.Content className='fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-elevated rounded-xl border border-border shadow-elevated overflow-hidden max-h-[90vh] flex flex-col focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0'>
          <Dialog.Title className='sr-only'>{REGISTRATION_COPY.dialogTitle}</Dialog.Title>

          {/* Live region for announcements */}
          <div role='status' aria-live='polite' className='sr-only'>
            {announcement}
          </div>

          {/* Scrollable content wrapper */}
          <div className='overflow-y-auto max-h-[90vh]'>
            {/* Header */}
            <div className='relative px-8 pt-8 pb-4'>
              {!isSuccess ? (
                <>
                  <h2 className='text-2xl font-display font-bold text-text-primary mb-2'>
                    {REGISTRATION_COPY.dialogHeading}
                  </h2>
                  <p className='text-text-secondary text-sm'>{REGISTRATION_COPY.dialogSubtitle}</p>
                </>
              ) : (
                <div className='text-center py-6'>
                  <div className='w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4'>
                    <Check className='w-8 h-8 text-secondary' />
                  </div>
                  <h2 className='text-2xl font-display font-bold text-text-primary mb-2'>
                    {REGISTRATION_COPY.successTitle}
                  </h2>
                  <p className='text-text-secondary'>{REGISTRATION_COPY.successBody}</p>
                </div>
              )}
            </div>

            {/* Form or Success */}
            {!isSuccess ? (
              <form
                onSubmit={handleSubmit}
                ref={formRef}
                className='px-8 pb-8 space-y-4'
                noValidate
              >
                {/* School Name */}
                <div>
                  <label
                    htmlFor='schoolName'
                    className='block text-sm font-medium text-text-primary mb-2'
                  >
                    Kooli nimi <span className='text-red-600 dark:text-red-400'>*</span>
                  </label>
                  <input
                    id='schoolName'
                    type='text'
                    required
                    minLength={3}
                    placeholder='Kooli ametlik nimi'
                    className={inputClassName(!!errors.schoolName)}
                    value={formData.schoolName}
                    onChange={(e) => handleChange('schoolName', e.target.value)}
                    onBlur={() => handleBlur('schoolName')}
                    autoComplete='organization'
                    aria-invalid={errors.schoolName ? 'true' : 'false'}
                    aria-describedby={errors.schoolName ? 'schoolName-error' : undefined}
                  />
                  {errors.schoolName && (
                    <p
                      id='schoolName-error'
                      className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                    >
                      <AlertCircle className='w-4 h-4' />
                      {errors.schoolName}
                    </p>
                  )}
                </div>

                {/* Contact Name */}
                <div>
                  <label
                    htmlFor='contactName'
                    className='block text-sm font-medium text-text-primary mb-2'
                  >
                    Kontaktisiku nimi <span className='text-red-600 dark:text-red-400'>*</span>
                  </label>
                  <input
                    id='contactName'
                    type='text'
                    required
                    placeholder='Ees- ja perekonnanimi'
                    className={inputClassName(!!errors.contactName)}
                    value={formData.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    onBlur={() => handleBlur('contactName')}
                    autoComplete='name'
                    aria-invalid={errors.contactName ? 'true' : 'false'}
                    aria-describedby={errors.contactName ? 'contactName-error' : undefined}
                  />
                  {errors.contactName && (
                    <p
                      id='contactName-error'
                      className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                    >
                      <AlertCircle className='w-4 h-4' />
                      {errors.contactName}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor='role'
                    className='block text-sm font-medium text-text-primary mb-2'
                  >
                    Roll <span className='text-red-600 dark:text-red-400'>*</span>
                  </label>
                  <select
                    id='role'
                    required
                    className={inputClassName(!!errors.role)}
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    onBlur={() => handleBlur('role')}
                    aria-invalid={errors.role ? 'true' : 'false'}
                    aria-describedby={errors.role ? 'role-error' : undefined}
                  >
                    <option value='' disabled className='text-text-secondary'>
                      Valige oma roll
                    </option>
                    {roles.map((role) => (
                      <option key={role} value={role} className='text-text-primary'>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p
                      id='role-error'
                      className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                    >
                      <AlertCircle className='w-4 h-4' />
                      {errors.role}
                    </p>
                  )}
                </div>

                {/* Other Role (conditional) */}
                {formData.role === 'Muu haridustöötaja' && (
                  <div>
                    <label
                      htmlFor='otherRole'
                      className='block text-sm font-medium text-text-primary mb-2'
                    >
                      Täpsustage roll <span className='text-red-600 dark:text-red-400'>*</span>
                    </label>
                    <input
                      id='otherRole'
                      type='text'
                      required
                      placeholder='Teie roll koolis'
                      className={inputClassName(!!errors.otherRole)}
                      value={formData.otherRole}
                      onChange={(e) => handleChange('otherRole', e.target.value)}
                      onBlur={() => handleBlur('otherRole')}
                      aria-invalid={errors.otherRole ? 'true' : 'false'}
                      aria-describedby={errors.otherRole ? 'otherRole-error' : undefined}
                    />
                    {errors.otherRole && (
                      <p
                        id='otherRole-error'
                        className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                      >
                        <AlertCircle className='w-4 h-4' />
                        {errors.otherRole}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-text-primary mb-2'
                  >
                    Asutuse e-post <span className='text-red-600 dark:text-red-400'>*</span>
                  </label>
                  <input
                    id='email'
                    type='email'
                    required
                    placeholder='nimi@kool.ee'
                    className={inputClassName(!!errors.email)}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    autoComplete='email'
                    inputMode='email'
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p
                      id='email-error'
                      className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                    >
                      <AlertCircle className='w-4 h-4' />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-text-primary mb-2'
                  >
                    Telefoninumber <span className='text-red-600 dark:text-red-400'>*</span>
                  </label>
                  <input
                    id='phone'
                    type='tel'
                    required
                    placeholder='+372 5XXX XXXX'
                    className={inputClassName(!!errors.phone)}
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    autoComplete='tel'
                    inputMode='tel'
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p
                      id='phone-error'
                      className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                    >
                      <AlertCircle className='w-4 h-4' />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Class Groups */}
                <div>
                  <label
                    htmlFor='classGroups'
                    className='block text-sm font-medium text-text-primary mb-2'
                  >
                    7.-9. klassi klassirühmade arv{' '}
                    <span className='text-red-600 dark:text-red-400'>*</span>
                  </label>
                  <input
                    id='classGroups'
                    type='text'
                    required
                    placeholder='Näiteks: 4 paralleelklassi 8. klassis'
                    className={inputClassName(!!errors.classGroups)}
                    value={formData.classGroups}
                    onChange={(e) => handleChange('classGroups', e.target.value)}
                    onBlur={() => handleBlur('classGroups')}
                    aria-invalid={errors.classGroups ? 'true' : 'false'}
                    aria-describedby={errors.classGroups ? 'classGroups-error' : undefined}
                  />
                  {errors.classGroups && (
                    <p
                      id='classGroups-error'
                      className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                    >
                      <AlertCircle className='w-4 h-4' />
                      {errors.classGroups}
                    </p>
                  )}
                </div>

                {/* Consent */}
                <div>
                  <label
                    htmlFor='consent'
                    className='flex items-start gap-3 text-sm text-text-secondary cursor-pointer'
                  >
                    <input
                      id='consent'
                      type='checkbox'
                      required
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        // Clear the consent error as soon as the box is checked
                        if (e.target.checked)
                          setErrors((prev) => ({ ...prev, consent: undefined }));
                      }}
                      className='mt-0.5 h-5 w-5 shrink-0 rounded border-border accent-primary focus-ring-target'
                      aria-invalid={errors.consent ? 'true' : 'false'}
                      aria-describedby={errors.consent ? 'consent-error' : undefined}
                    />
                    <span>
                      Olen nõus, et MATx kasutab minu andmeid piloodi registreerimiseks.{' '}
                      <Link
                        href='/privaatsus'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary underline hover:text-secondary transition-colors focus-ring-target rounded-sm'
                      >
                        Privaatsuspoliitika
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.consent && (
                    <p
                      id='consent-error'
                      className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                    >
                      <AlertCircle className='w-4 h-4' />
                      {errors.consent}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                {submitError && (
                  <p
                    role='alert'
                    className='mt-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
                  >
                    <AlertCircle className='w-4 h-4 shrink-0' />
                    {REGISTRATION_COPY.announcementError}
                  </p>
                )}
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full py-4 rounded-lg bg-primary text-text-inverse font-semibold hover:bg-primary/90 transition-colors focus-ring-target min-h-[44px] mt-2 disabled:opacity-60'
                >
                  {isSubmitting ? REGISTRATION_COPY.submitting : REGISTRATION_COPY.submit}
                </button>

                <p className='text-center text-xs text-text-secondary'>
                  {REGISTRATION_COPY.contactNote}
                </p>
              </form>
            ) : (
              <div className='px-8 pb-8 text-center'>
                <div className='bg-secondary/10 rounded-xl p-6 mb-6 text-left'>
                  <h3 className='font-semibold text-text-primary mb-3'>
                    {REGISTRATION_COPY.nextStepsHeading}
                  </h3>
                  <ol className='space-y-3 text-sm text-text-secondary'>
                    <li className='flex items-start gap-4'>
                      <span className='w-6 h-6 rounded-full bg-secondary/20 text-secondary text-sm flex items-center justify-center shrink-0'>
                        1
                      </span>
                      <span>{REGISTRATION_COPY.nextStep1}</span>
                    </li>
                    <li className='flex items-start gap-4'>
                      <span className='w-6 h-6 rounded-full bg-secondary/20 text-secondary text-sm flex items-center justify-center shrink-0'>
                        2
                      </span>
                      <span>{REGISTRATION_COPY.nextStep2}</span>
                    </li>
                    <li className='flex items-start gap-4'>
                      <span className='w-6 h-6 rounded-full bg-secondary/20 text-secondary text-sm flex items-center justify-center shrink-0'>
                        3
                      </span>
                      <span>Sügisene pilootkatsetus algus: August 2026</span>
                    </li>
                  </ol>
                </div>

                <p className='text-text-secondary text-sm mb-4'>Küsimused?</p>
                <a
                  href={`mailto:${REGISTRATION_COPY.contactEmail}`}
                  className='text-primary hover:text-secondary transition-colors text-sm focus-ring-target rounded-md underline'
                >
                  {REGISTRATION_COPY.contactEmail}
                </a>

                <button
                  type='button'
                  onClick={handleClearAndClose}
                  className='block w-full mt-6 py-3 rounded-lg border border-border text-text-primary hover:bg-surface transition-colors focus-ring-target min-h-[44px]'
                >
                  Sulge
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <Dialog.Close asChild>
            <button
              type='button'
              className='absolute top-4 right-4 w-11 h-11 rounded-lg bg-surface flex items-center justify-center hover:bg-surface/80 transition-colors focus-ring-target'
              aria-label='Sulge'
            >
              <X className='w-5 h-5 text-text-secondary' />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
