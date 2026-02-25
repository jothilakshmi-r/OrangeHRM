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
    this.noRecordsText = this.page.locator('text=/No matching records|No Data|No records found/i');
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
    // Wait for the table to update after search
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.assertion });
  }

  /**
   * Searches for employees by employee ID.
   * @param employeeId - Employee ID to search for
   */
  async searchById(employeeId: string): Promise<void> {
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
    // Wait for the table to update after search
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.assertion });
  }

  /**
   * Deletes the first employee entry in the current search results.
   */
  async deleteFirstEmployee(): Promise<void> {
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
    // Wait for the delete operation to complete
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.assertion });
  }

  /**
   * Verifies that the employee table shows "No matching records" message.
   * Useful for verifying that a deleted employee no longer exists.
   * Uses both text detection and row count as fallback.
   */
  async verifyNoRecordsFound(): Promise<void> {
    try {
      // Try to find the text message first
      await expect(this.noRecordsText).toBeVisible({ timeout: 5000 });
    } catch {
      // If message not found, verify by row count (table should have 0 rows)
      const rowCount = await this.getVisibleRowCount();
      if (rowCount === 0) {
        // No records found - this is expected
        return;
      }
      // If we still have rows, this is an error
      throw new Error(`Expected no employee records but found ${rowCount} row(s)`);
    }
  }

  /**
   * Clears all search filters and resets the table to show all employees.
   */
  async clearSearch(): Promise<void> {
    await this.employeeNameInput.clear();
    await this.employeeIdInput.clear();
    await this.searchButton.click();
    // Wait for the table to update after clearing filters
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.assertion });
  }

  /**
   * Gets the count of visible employee rows in the table.
   */
  async getVisibleRowCount(): Promise<number> {
    return await this.tableRows.count();
  }
}
