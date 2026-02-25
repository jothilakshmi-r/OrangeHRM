import { Page, expect } from '@playwright/test';
import { EmployeeForm } from '../components/EmployeeForm.component';
import { EmployeeTable } from '../components/EmployeeTable.component';

/**
 * PIM Page Object - Represents the PIM (Personnel Information Management) page.
 * Composes EmployeeForm and EmployeeTable components following CPOM pattern.
 */
export class PIMPage {
  readonly employeeForm: EmployeeForm;
  readonly employeeTable: EmployeeTable;

  constructor(private readonly page: Page) {
    this.employeeForm = new EmployeeForm(page);
    this.employeeTable = new EmployeeTable(page);
  }

  /**
   * Verifies that the current page is the PIM module by checking the URL.
   */
  async verifyPIM(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\//);
  }

  /**
   * Navigates to the PIM module.
   */
  async navigateToPIM(): Promise<void> {
    await this.page.goto('/pim/viewEmployeeList');
    await this.verifyPIM();
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