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
    rules: {
      // This project does not use the React Compiler; the compiler-style
      // purity rules flag intentional patterns:
      //  - set-state-in-effect: hydration-gated client-only initialization
      //    (localStorage draft rehydration, "ready" flag before mounting
      //    WebGL) and lazy Lenis instance creation.
      //  - purity: procedural particle data generated with Math.random()
      //    inside useMemo for the R3F hero fields.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
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
