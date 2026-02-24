import { test as setup, expect } from '@playwright/test';
import { authData } from '../test-data/auth.data';
import { TIMEOUTS } from '../config/timeouts';
import { ROUTES } from '../config/routes';

setup.setTimeout(TIMEOUTS.setupTest);

setup('authenticate', async ({ page }) => {
  await page.goto(ROUTES.login);

  await page.fill('input[name="username"]', authData.username);
  await page.fill('input[name="password"]', authData.password);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/, { timeout: TIMEOUTS.assertion });

  await page.context().storageState({ path: 'storage/auth.json' });
});