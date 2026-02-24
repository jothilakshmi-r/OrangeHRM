import { Locator, Page, expect } from '@playwright/test';
import { EmployeeForm } from '../components/EmployeeForm.component';

export class PIMPage {
  readonly employeeForm: EmployeeForm;
  private readonly employeeNameInput: Locator;
  private readonly employeeIdInput: Locator;
  private readonly searchButton: Locator;
  private readonly deleteButton: Locator;
  private readonly confirmDeleteButton: Locator;

  constructor(private readonly page: Page) {
    this.employeeForm = new EmployeeForm(page);
    this.employeeNameInput = this.page.locator('input[placeholder="Type for hints..."]').first();
    this.employeeIdInput = this.page.locator('label:has-text("Employee Id")').locator('xpath=ancestor::div[contains(@class,"oxd-input-group")]//input');
    this.searchButton = this.page.getByRole('button', { name: 'Search' });
    this.deleteButton = this.page.locator('i.bi-trash').first();
    this.confirmDeleteButton = this.page.getByRole('button', { name: 'Yes, Delete' });
  }

  /**
   * Verifies that the current page belongs to the PIM module.
   */
  async verifyPIM() {
    await expect(this.page).toHaveURL(/\/pim\//);
  }

  /**
   * Searches employees by name using the Employee Information filter.
   */
  async searchEmployee(name: string) {
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
  }

  /**
   * Searches employees by employee id.
   */
  async searchEmployeeById(employeeId: string) {
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
  }

  /**
   * Deletes the first employee entry in the current filtered result set.
   */
  async deleteEmployee() {
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
  }

  /**
   * Asserts that an employee row with the provided full name exists.
   */
  async expectEmployeeInResults(fullName: string) {
    await expect(this.employeeRowsByName(fullName)).toHaveCount(1);
  }

  /**
   * Asserts that an employee row with the provided full name does not exist.
   */
  async expectEmployeeNotInResults(fullName: string) {
    await expect(this.employeeRowsByName(fullName)).toHaveCount(0);
  }

  /**
   * Asserts that an employee row with the provided employee id exists.
   */
  async expectEmployeeIdInResults(employeeId: string) {
    await expect(this.employeeRowsByText(employeeId)).toHaveCount(1);
  }

  /**
   * Asserts that an employee row with the provided employee id does not exist.
   */
  async expectEmployeeIdNotInResults(employeeId: string) {
    await expect(this.employeeRowsByText(employeeId)).toHaveCount(0);
  }

  /**
   * Returns table rows filtered by full name.
   */
  private employeeRowsByName(fullName: string) {
    return this.page.locator('.oxd-table-body .oxd-table-row', { hasText: fullName });
  }

  /**
   * Returns table rows filtered by any text value.
   */
  private employeeRowsByText(text: string) {
    return this.page.locator('.oxd-table-body .oxd-table-row', { hasText: text });
  }
}