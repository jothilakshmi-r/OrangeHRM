export type PimEmployeeData = {
  firstName: string;
  lastName: string;
};

export function buildPimEmployeeData(): PimEmployeeData {
  const uniqueId = Date.now().toString().slice(-6);

  return {
    firstName: `John${uniqueId}`,
    lastName: 'Tester',
  };
}
