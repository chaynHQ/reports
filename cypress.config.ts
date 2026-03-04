import { defineConfig } from 'cypress'

export default defineConfig({
  // Register at https://cloud.cypress.io to obtain a projectId.
  // Set CYPRESS_PROJECT_ID in .env.local and in GitHub Actions secrets.
  projectId: process.env.CYPRESS_PROJECT_ID,

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    setupNodeEvents(_on, _config) {},
  },
})
