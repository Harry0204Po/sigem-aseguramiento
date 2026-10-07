// Configuración de pruebas de sistema, aceptación, seguridad y usabilidad (end-to-end).
// La aplicación es estática: se sirve con http-server igual que en GitHub Pages.
const { defineConfig, devices } = require('@playwright/test');

const launchOptions = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  webServer: {
    command: 'npx http-server . -p 4173 -c-1 -s',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    locale: 'es-GT',
    timezoneId: 'America/Guatemala',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions,
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], launchOptions }, testIgnore: /usabilidad-movil/ },
    { name: 'movil', use: { ...devices['Pixel 5'], launchOptions }, testMatch: /usabilidad-movil/ },
  ],
});
