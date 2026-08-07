'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Check, Loader2, AlertCircle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

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
}

const STORAGE_KEY = 'matx-registration-draft';

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

export function RegistrationForm({ isOpen, onClose }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [announcement, setAnnouncement] = useState('');

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
  }, []);

  // Save draft to localStorage on form data change
  useEffect(() => {
    if (typeof window !== 'undefined' && formData !== initialFormData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const validateField = useCallback((name: string, value: string): string | undefined => {
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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Sisestage kehtiv e-posti aadress';
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
  }, [formData.role]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    const fields = ['schoolName', 'contactName', 'role', 'email', 'phone', 'classGroups'];
    if (formData.role === 'Muu haridustöötaja') {
      fields.push('otherRole');
    }

    fields.forEach((field) => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) newErrors[field as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleBlur = useCallback((name: string) => {
    setTouched((prev) => new Set(prev).add(name));
    const error = validateField(name, formData[name as keyof FormData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [formData, validateField]);

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Re-validate on change if already touched
    if (touched.has(name)) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = ['schoolName', 'contactName', 'role', 'email', 'phone', 'classGroups'];
    if (formData.role === 'Muu haridustöötaja') {
      allFields.push('otherRole');
    }
    setTouched(new Set(allFields));

    if (!validateForm()) {
      setAnnouncement('Palun parandage vormi vead enne saatmist');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      clearDraft();
      setAnnouncement('Registreering edukalt saadetud');
    } catch {
      setErrors({ email: 'Saatmine ebaõnnestus. Palun proovige uuesti.' });
      setAnnouncement('Saatmine ebaõnnestus');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, clearDraft]);

  const handleClose = useCallback(() => {
    setIsSuccess(false);
    setErrors({});
    setTouched(new Set());
    onClose();
  }, [onClose]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      // Check if form is dirty before closing
      const isDirty = Object.entries(formData).some(([key, value]) => {
        if (key === 'otherRole' && formData.role !== 'Muu haridustöötaja') return false;
        return value.trim() !== '';
      });

      if (isDirty && !isSuccess) {
        // Form has unsaved data - close and clear
        setFormData(initialFormData);
        clearDraft();
        handleClose();
      } else {
        handleClose();
      }
    }
  }, [formData, isSuccess, handleClose, clearDraft]);

  const handleClearAndClose = useCallback(() => {
    setFormData(initialFormData);
    clearDraft();
    handleClose();
  }, [clearDraft, handleClose]);

  const inputClassName = (hasError: boolean): string =>
    `w-full px-4 py-3 rounded-lg bg-surface border text-text-primary placeholder:text-text-secondary/50 focus-ring-target transition-colors ${
      hasError ? 'border-red-600 dark:border-red-400 focus:border-red-600 dark:focus:border-red-400' : 'border-border'
    }`;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-elevated rounded-xl border border-border shadow-elevated overflow-hidden max-h-[90vh] overflow-y-auto focus:outline-none">
          <Dialog.Title className="sr-only">Registreeri kool pilootkatsetusele</Dialog.Title>

          {/* Live region for announcements */}
          <div
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            {announcement}
          </div>

          {/* Header */}
          <div className="relative px-8 pt-8 pb-4">
            {!isSuccess ? (
              <>
                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
                  Registreeri oma kool pilootkatsetusele
                </h2>
                <p className="text-text-secondary text-sm">
                  Targa Tuleviku Fondi toetusel. Tasuta. Kohustusteta.
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
                  Registreering kinnitatud!
                </h2>
                <p className="text-text-secondary">
                  Täname, {formData.schoolName}!
                </p>
              </div>
            )}
          </div>

          {/* Form or Success */}
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4" noValidate>
              {/* School Name */}
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-text-primary mb-2">
                  Kooli nimi <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  id="schoolName"
                  type="text"
                  required
                  minLength={3}
                  placeholder="Kooli ametlik nimi"
                  className={inputClassName(!!errors.schoolName)}
                  value={formData.schoolName}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                  onBlur={() => handleBlur('schoolName')}
                  autoComplete="organization"
                  aria-invalid={errors.schoolName ? 'true' : 'false'}
                  aria-describedby={errors.schoolName ? 'schoolName-error' : undefined}
                />
                {errors.schoolName && (
                  <p id="schoolName-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.schoolName}
                  </p>
                )}
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-text-primary mb-2">
                  Kontaktisiku nimi <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  id="contactName"
                  type="text"
                  required
                  placeholder="Ees- ja perekonnanimi"
                  className={inputClassName(!!errors.contactName)}
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  onBlur={() => handleBlur('contactName')}
                  autoComplete="name"
                  aria-invalid={errors.contactName ? 'true' : 'false'}
                  aria-describedby={errors.contactName ? 'contactName-error' : undefined}
                />
                {errors.contactName && (
                  <p id="contactName-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.contactName}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
                  Roll <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <select
                  id="role"
                  required
                  className={inputClassName(!!errors.role)}
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  onBlur={() => handleBlur('role')}
                  aria-invalid={errors.role ? 'true' : 'false'}
                  aria-describedby={errors.role ? 'role-error' : undefined}
                >
                  <option value="" disabled className="text-text-secondary">
                    Valige oma roll
                  </option>
                  {roles.map((role) => (
                    <option key={role} value={role} className="text-text-primary">
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p id="role-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Other Role (conditional) */}
              {formData.role === 'Muu haridustöötaja' && (
                <div>
                  <label htmlFor="otherRole" className="block text-sm font-medium text-text-primary mb-2">
                    Täpsustage roll <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <input
                    id="otherRole"
                    type="text"
                    required
                    placeholder="Teie roll koolis"
                    className={inputClassName(!!errors.otherRole)}
                    value={formData.otherRole}
                    onChange={(e) => handleChange('otherRole', e.target.value)}
                    onBlur={() => handleBlur('otherRole')}
                    aria-invalid={errors.otherRole ? 'true' : 'false'}
                    aria-describedby={errors.otherRole ? 'otherRole-error' : undefined}
                  />
                  {errors.otherRole && (
                    <p id="otherRole-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.otherRole}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Asutuse e-post <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="nimi@kool.ee"
                  className={inputClassName(!!errors.email)}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                  Telefoninumber <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+372 5XXX XXXX"
                  className={inputClassName(!!errors.phone)}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Class Groups */}
              <div>
                <label htmlFor="classGroups" className="block text-sm font-medium text-text-primary mb-2">
                  7.-9. klassi klassirühmade arv <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  id="classGroups"
                  type="text"
                  required
                  placeholder="Näiteks: 4 paralleelklassi 8. klassis"
                  className={inputClassName(!!errors.classGroups)}
                  value={formData.classGroups}
                  onChange={(e) => handleChange('classGroups', e.target.value)}
                  onBlur={() => handleBlur('classGroups')}
                  aria-invalid={errors.classGroups ? 'true' : 'false'}
                  aria-describedby={errors.classGroups ? 'classGroups-error' : undefined}
                />
                {errors.classGroups && (
                  <p id="classGroups-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.classGroups}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg bg-primary text-text-inverse font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring-target min-h-[44px] mt-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saatmine...
                  </span>
                ) : (
                  'Esita registreering'
                )}
              </button>

              <p className="text-center text-xs text-text-secondary">
                Võtame ühendust 48 tunni jooksul
              </p>
            </form>
          ) : (
            <div className="px-8 pb-8 text-center">
              <div className="bg-secondary/10 rounded-xl p-6 mb-6 text-left">
                <h3 className="font-semibold text-text-primary mb-3">Järgmised sammud:</h3>
                <ol className="space-y-3 text-sm text-text-secondary">
                  <li className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-sm flex items-center justify-center shrink-0">1</span>
                    <span>Broneeri 15-minutiline vestlus (link tuleb meilil)</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-sm flex items-center justify-center shrink-0">2</span>
                    <span>Allkirjasta digitaalne toetuskiri</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-sm flex items-center justify-center shrink-0">3</span>
                    <span>Sügisene pilootkatsetus algus: August 2026</span>
                  </li>
                </ol>
              </div>

              <p className="text-text-secondary text-sm mb-4">
                Küsimused?
              </p>
              <a
                href="mailto:andri@matx.ee"
                className="text-primary hover:text-secondary transition-colors text-sm focus-ring-target rounded-md"
                style={{ textDecoration: 'underline' }}
              >
                andri@matx.ee
              </a>

              <button
                onClick={handleClearAndClose}
                className="block w-full mt-6 py-3 rounded-lg border border-border text-text-primary hover:bg-surface transition-colors focus-ring-target min-h-[44px]"
              >
                Sulge
              </button>
            </div>
          )}

          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 w-11 h-11 rounded-lg bg-surface flex items-center justify-center hover:bg-surface/80 transition-colors focus-ring-target"
              aria-label="Sulge"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
