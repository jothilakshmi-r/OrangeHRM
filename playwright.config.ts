import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { TIMEOUTS } from './e2e/config/timeouts';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({

  expect: {
    timeout: TIMEOUTS.assertion,
  },

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  testDir: './e2e',
  testMatch: ['tests/**/*.page.ts', 'utils/**/*.setup.ts'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'utils/**/*.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://opensource-demo.orangehrmlive.com',
      },
    },

    {
      name: 'chromium',
      testMatch: 'tests/**/*.page.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storage/auth.json',
      },
    },

    {
      name: 'firefox',
      testMatch: 'tests/**/*.page.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'storage/auth.json',
      },
    },

    {
      name: 'webkit',
      testMatch: 'tests/**/*.page.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: 'storage/auth.json',
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
