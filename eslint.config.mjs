import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// Flat config for ESLint 9 + Next.js 16 (the legacy `.eslintrc.json` +
// `next lint` path was removed in Next.js 16).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    name: 'matx/intentional-react-hooks-patterns',
    files: ['components/ui/registration-form.tsx'],
    rules: {
      // Hydration-gated localStorage draft rehydration: reading the saved
      // draft once in an effect and calling setFormData is intentional and
      // can't move into the state initializer without a hydration mismatch.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    name: 'matx/cjs-config-files',
    files: ['tailwind.config.ts'],
    rules: {
      // Tailwind configs load CJS plugins via require() by convention.
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
