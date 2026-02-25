import { Page } from '@playwright/test';
import { Dashboard } from '../components/Dashboard.component';

/**
 * Dashboard Page Object - Represents the dashboard page and composes reusable components.
 */
export class DashboardPage {
  readonly dashboard: Dashboard;

  constructor(private readonly page: Page) {
    this.dashboard = new Dashboard(page);
  }

  /**
   * Navigate to the dashboard and verify it loads correctly.
   */
  async navigate(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.dashboard.verifyDashboard();
  }

  /**
   * Verify the dashboard is displayed correctly.
   */
  async verifyDashboard(): Promise<void> {
    await this.dashboard.verifyDashboard();
  }
}
