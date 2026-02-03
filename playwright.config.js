const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 120 * 1000,
  expect: {
    timeout: 10 * 1000
  },
  use: {
    baseURL: 'http://47.97.84.212:3000',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10 * 1000,
    navigationTimeout: 90 * 1000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-report/report.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ]
});
