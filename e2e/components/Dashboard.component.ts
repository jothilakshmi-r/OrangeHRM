import { Locator, Page, expect } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';

/**
 * Dashboard Component - Handles dashboard-specific interactions and verifications.
 * Part of the Component Page Object Model (CPOM) pattern.
 */
export class Dashboard {
  private readonly dashboardHeading: Locator;
  private readonly quickLaunchSection: Locator;

  constructor(private readonly page: Page) {
    this.dashboardHeading = this.page.locator('h6:has-text("Dashboard")');
    this.quickLaunchSection = this.page.locator('text=Quick Launch');
  }

  /**
   * Verifies that the dashboard page has loaded successfully by checking for key elements.
   */
  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.dashboardHeading).toBeVisible({ timeout: TIMEOUTS.assertion });
    await expect(this.quickLaunchSection).toBeVisible({ timeout: TIMEOUTS.assertion });
  }

  /**
   * Verifies that the page URL is on the dashboard route.
   */
  async verifyDashboardUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/, { timeout: TIMEOUTS.assertion });
  }

  /**
   * Performs a full dashboard verification (URL + UI elements).
   */
  async verifyDashboard(): Promise<void> {
    await this.verifyDashboardUrl();
    await this.verifyDashboardLoaded();
  }
}
