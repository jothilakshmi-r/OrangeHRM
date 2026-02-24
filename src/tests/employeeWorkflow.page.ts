import { test } from '@playwright/test';
import { Header } from '../components/Header.component';
import { SideNav } from '../components/Sidenav.component';
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

    const header = new Header(page);
    const sideNav = new SideNav(page);
    const pimPage = new PIMPage(page);

    await test.step('Open dashboard', async () => {
      await page.goto(ROUTES.dashboard);
      addLog('Opened dashboard URL.');
    });

    await test.step('Verify dashboard screen', async () => {
      await header.verifyDashboard();
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
      await pimPage.searchEmployeeById(employeeId);
      await pimPage.expectEmployeeIdInResults(employeeId);
      addLog(`Verified employeeId=${employeeId} is present in results.`);
    });

    await test.step('Delete employee', async () => {
      await pimPage.deleteEmployee();
      addLog(`Deleted employeeId=${employeeId}.`);
    });

    await test.step('Verify employee deletion', async () => {
      await sideNav.goToPIM();
      await pimPage.searchEmployeeById(employeeId);
      await pimPage.expectEmployeeIdNotInResults(employeeId);
      addLog(`Verified employeeId=${employeeId} is absent in results.`);
    });

    await testInfo.attach('execution-log', {
      body: executionLogs.join('\n'),
      contentType: 'text/plain',
    });
  });

});