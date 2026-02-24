/// <reference types="vitest" />
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { coverageConfigDefaults, configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  resolve: {
    alias: {
      __fixtures__: '/src/__fixtures__',
      assets: '/src/assets',
      common: '/src/common',
      pages: '/src/pages',
      test: '/src/test',
    },
  },
  test: {
    exclude: [...configDefaults.exclude],
    coverage: {
      provider: 'v8',
      exclude: [
        '**/__fixtures__/**',
        '**/__mocks__/**',
        'android/**',
        'src/main.tsx',
        'src/test',
        'capacitor.config.ts',
        ...coverageConfigDefaults.exclude,
      ],
      reporter: ['text', 'json', 'json-summary', 'html'],
    },
    globals: true,
    environment: 'jsdom',
    mockReset: true,
    setupFiles: './src/setupTests.ts',
  },
});
