import { Locator, Page, expect } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';

/**
 * EmployeeTable Component - Handles search and delete operations on the employee list table.
 * Part of the Component Page Object Model (CPOM) pattern.
 */
export class EmployeeTable {
  private readonly employeeNameInput: Locator;
  private readonly employeeIdInput: Locator;
  private readonly searchButton: Locator;
  private readonly deleteButton: Locator;
  private readonly confirmDeleteButton: Locator;
  private readonly noRecordsText: Locator;
  private readonly tableRows: Locator;
  private readonly emptyMessageContainer: Locator;

  constructor(private readonly page: Page) {
    this.employeeNameInput = this.page.locator('input[placeholder="Type for hints..."]').first();
    this.employeeIdInput = this.page.locator('label:has-text("Employee Id")').locator('xpath=ancestor::div[contains(@class,"oxd-input-group")]//input');
    this.searchButton = this.page.getByRole('button', { name: 'Search' });
    this.deleteButton = this.page.locator('i.bi-trash').first();
    this.confirmDeleteButton = this.page.getByRole('button', { name: 'Yes, Delete' });
    // Target the table-area "No Records Found" text (avoid toast match; use first() to handle multiple matches)
    this.noRecordsText = this.page.locator('text=/No matching records|No Data|No records found/i').first();
    this.tableRows = this.page.locator('div.oxd-table-body >> div.oxd-table-card');
    this.emptyMessageContainer = this.page.locator('div.orangehrm-empty-state-container, div.text-center:has-text("No matching records")');
  }

  /**
   * Searches for employees by name.
   * @param name - Employee name to search for
   */
  async searchByName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
  }

  /**
   * Searches for employees by employee ID.
   * @param employeeId - Employee ID to search for
   */
  async searchById(employeeId: string): Promise<void> {
    // Ensure name filter is cleared so search filters only by ID
    await this.employeeNameInput.fill('');
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();

    // Wait for either the specific row to appear or the empty message
    const row = this.rowForEmployeeId(employeeId);
    try {
      await expect(row).toBeVisible({ timeout: TIMEOUTS.assertion });
    } catch {
      // If row not visible, wait for empty message as fallback
      await this.emptyMessageContainer.waitFor({ state: 'visible', timeout: TIMEOUTS.assertion }).catch(() => null);
    }
  }

  /**
   * Deletes the first employee entry in the current search results.
   * Verifies deletion by waiting for the "No Records Found" message.
   */
  async deleteFirstEmployee(employeeId?: string): Promise<void> {
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
    // Verify deletion by waiting for "No Records Found" or empty state message.
    await this.noRecordsText.waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });
  }

  /**
   * Verifies that the employee table shows "No matching records" message.
   * Useful for verifying that a deleted employee no longer exists.
   * Uses both text detection and row count as fallback.
   */
  async verifyNoRecordsFound(): Promise<void> {
    await expect(this.noRecordsText).toBeVisible({ timeout: 5000 });
      
    const rowCount = await this.getVisibleRowCount();
    if (rowCount === 0) return;
    throw new Error(`Expected no employee records but found ${rowCount} row(s)`);
  }

  /**
   * Clears all search filters and resets the table to show all employees.
   */
  async clearSearch(): Promise<void> {
    await this.employeeNameInput.clear();
    await this.employeeIdInput.clear();
    await this.searchButton.click();
  }

  /**
   * Gets the count of visible employee rows in the table.
   */
  async getVisibleRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  /**
   * Returns a locator for the table row that contains the given employee id.
   */
  private rowForEmployeeId(employeeId: string) {
    return this.page.locator(`div.oxd-table-body >> div:has-text("${employeeId}")`);
  }

  /**
   * Assert the employee row is present for the given id.
   */
  async expectEmployeePresent(employeeId: string) {
    const row = this.rowForEmployeeId(employeeId);
    await expect(row).toBeVisible({ timeout: TIMEOUTS.assertion });
  }

  /**
   * Assert the employee row is absent for the given id.
   */
  async expectEmployeeAbsent(employeeId: string) {
    const row = this.rowForEmployeeId(employeeId);
    await expect(row).toHaveCount(0, { timeout: TIMEOUTS.assertion });
  }
}
