import { Page, expect } from '@playwright/test';

export class Header {
  constructor(private page: Page) {}

  /**
   * Verifies that the user is on the dashboard page.
   */
  async verifyDashboard() {
    await expect(this.page).toHaveURL(/dashboard/);
  }
}