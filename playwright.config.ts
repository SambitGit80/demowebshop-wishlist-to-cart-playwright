import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://demowebshop.tricentis.com',
    headless: process.env.HEADED !== '1',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
