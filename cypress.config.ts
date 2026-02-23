import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    allowCypressEnv: false,
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
