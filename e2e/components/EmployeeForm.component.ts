import { expect, Locator, Page } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';

export class EmployeeForm {
  private readonly addButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly employeeIdInput: Locator;
  private readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.addButton = this.page.getByRole('button', { name: 'Add' });
    this.firstNameInput = this.page.locator('input[name="firstName"]');
    this.lastNameInput = this.page.locator('input[name="lastName"]');
    this.employeeIdInput = this.page.locator('label:has-text("Employee Id")').locator('xpath=ancestor::div[contains(@class,"oxd-input-group")]//input');
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
  }

  /**
   * Adds a new employee from the PIM Add Employee form and returns the generated employee id.
   */
  async addEmployee(first: string, last: string): Promise<string> {
    await this.addButton.click();
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    const employeeId = this.generateEmployeeId();
    await this.employeeIdInput.fill(employeeId);
    await this.saveButton.click();

    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\//, {
      timeout: TIMEOUTS.navigation,
    });

    return employeeId;
  }

  /**
   * Generates a unique employee id value based on current timestamp.
   */
  private generateEmployeeId(): string {
    return Date.now().toString().slice(-8);
  }
}