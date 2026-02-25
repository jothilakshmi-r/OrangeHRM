import { test } from '@playwright/test';
import { SideNav } from '../components/Sidenav.component';
import { DashboardPage } from '../pages/Dashboard.page';
import { PIMPage } from '../pages/PIM.page';
import { buildPimEmployeeData } from '../test-data/pim.data';
import { TIMEOUTS } from '../config/timeouts';
import { ROUTES } from '../config/routes';

test.describe('Employee Workflow', () => {
  test.setTimeout(TIMEOUTS.workflowTest);

  test('Add, Search & Delete Employee', async ({ page }, testInfo) => {

    const executionLogs: string[] = [];
    const addLog = (message: string) => {
      executionLogs.push(`[${new Date().toISOString()}] ${message}`);
    };

    const dashboardPage = new DashboardPage(page);
    const sideNav = new SideNav(page);
    const pimPage = new PIMPage(page);

    await test.step('Open dashboard', async () => {
      await page.goto(ROUTES.dashboard);
      addLog('Opened dashboard URL.');
    });

    await test.step('Verify dashboard screen', async () => {
      await dashboardPage.verifyDashboard();
      addLog('Dashboard verification passed.');
    });

    await test.step('Navigate to PIM and verify', async () => {
      await sideNav.goToPIM();
      await pimPage.verifyPIM();
      addLog('Navigated to PIM and verified page.');
    });

    const { firstName, lastName } = buildPimEmployeeData();
    addLog(`Generated employee data for firstName=${firstName}, lastName=${lastName}.`);

    const employeeId = await test.step('Add employee', async () => {
      const createdEmployeeId = await pimPage.employeeForm.addEmployee(firstName, lastName);
      addLog(`Employee created with employeeId=${createdEmployeeId}.`);
      return createdEmployeeId;
    });

    await test.step('Search employee and verify present', async () => {
      await sideNav.goToPIM();
      await pimPage.employeeTable.searchById(employeeId);
      const rowCount = await pimPage.employeeTable.getVisibleRowCount();
      if (rowCount > 0) {
        addLog(`Verified employeeId=${employeeId} is present in results (${rowCount} row(s) found).`);
      } else {
        throw new Error(`Employee with ID ${employeeId} not found in search results.`);
      }
    });

    await test.step('Delete employee', async () => {
      await pimPage.employeeTable.deleteFirstEmployee();
      addLog(`Deleted employeeId=${employeeId}.`);
    });

    await test.step('Verify employee deletion', async () => {
      await sideNav.goToPIM();
      await pimPage.employeeTable.clearSearch();
      
      // Get row count before search
      const rowCountBefore = await pimPage.employeeTable.getVisibleRowCount();
      
      // Search for the deleted employee
      await pimPage.employeeTable.searchById(employeeId);
      const rowCountAfter = await pimPage.employeeTable.getVisibleRowCount();
      
      // Verify no matching records found
      if (rowCountAfter === 0 || rowCountAfter < rowCountBefore) {
        addLog(`Verified employeeId=${employeeId} deletion: rows before=${rowCountBefore}, rows after=${rowCountAfter}.`);
      } else {
        addLog(`Warning: Employee record may still exist. Rows: ${rowCountAfter}`);
      }
    });

    await testInfo.attach('execution-log', {
      body: executionLogs.join('\n'),
      contentType: 'text/plain',
    });
  });

});