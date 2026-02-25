# OrangeHRM Playwright E2E

This repository contains a Playwright + TypeScript end-to-end test suite for OrangeHRM, implemented using a Component Page Object Model (CPOM).

## Quick start

Prerequisites:
- Node.js >= 18
- npm
- Git

Install dependencies:

```bash
npm ci
```

Copy environment variables:

```bash
cp .env.example .env
# then edit .env to add ORANGEHRM_USERNAME and ORANGEHRM_PASSWORD
```

Run tests (headless Chromium):

```bash
npm run test:chromium
```

Run a single test (headed) for debugging:

```bash
npx playwright test e2e/tests/employeeWorkflow.page.ts --project=chromium --headed
```

View HTML report:

```bash
npx playwright show-report
```

## Important files
- `e2e/components` — CPOM components (EmployeeForm, EmployeeTable, Sidenav, Dashboard)
- `e2e/pages` — page objects composing components
- `e2e/tests` — tests (employee workflow)
- `e2e/config/timeouts.ts` — timeout constants
- `.github/workflows/playwright.yml` — CI workflow (runs Playwright and uploads artifacts)

## CI / Secrets
The GitHub Actions workflow requires repository secrets:
- `ORANGEHRM_USERNAME`
- `ORANGEHRM_PASSWORD`

The repo uses a `storage/auth.json` storageState file when running locally via the `auth.setup` helper. Do NOT commit credentials or override `.gitignore`.

## Stabilization notes
If tests appear slow or flaky, prefer:
- Waiting for a specific success indicator (toast) or row disappearance instead of `networkidle`.
- Targeted locators (`employeeId`) instead of scanning full tables with `locator.count()`.
