/**
 * The ESLint configuration in "flat config" format.
 *
 * Note: This configuration uses helper functions from `typescript-eslint`.
 *
 * @see {@link https://eslint.org/docs/latest/use/configure/ Configure ESLint}
 * @see {@link https://typescript-eslint.io/packages/typescript-eslint typescript-eslint}
 */
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

// Plugins
import reactHooks from 'eslint-plugin-react-hooks';
import { reactRefresh } from 'eslint-plugin-react-refresh';

export default defineConfig(
  globalIgnores([
    'android/**',
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'reports/**',
    'public/**',
    'infrastructure/dist/**',
    'infrastructure/cdk.out/**',
    'infrastructure/coverage/**',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite(),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
