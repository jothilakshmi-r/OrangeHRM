import { Locator, Page } from '@playwright/test';

export class SideNav {
  private readonly pimMenuItem: Locator;

  constructor(private readonly page: Page) {
    this.pimMenuItem = this.page.locator('a.oxd-main-menu-item', { hasText: 'PIM' });
  }

  /**
   * Navigates to the PIM module from the left side navigation.
   */
  async goToPIM() {
    await this.pimMenuItem.click();
  }
}