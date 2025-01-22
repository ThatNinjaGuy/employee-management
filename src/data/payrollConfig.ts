export const payrollComponents = {
  earnings: [
    {
      id: "basic",
      name: "Basic Salary",
      type: "percentage" as const,
      defaultValue: 50, // 50% of CTC
      editable: false,
    },
    {
      id: "hra",
      name: "House Rent Allowance",
      type: "percentage" as const,
      defaultValue: 20, // 20% of CTC
      editable: true,
    },
    {
      id: "specialAllowance",
      name: "Special Allowance",
      type: "calculated" as const,
      defaultValue: 0, // Automatically calculated
      editable: false,
    },
  ],
  deductions: [
    {
      id: "pf",
      name: "Provident Fund",
      type: "percentage" as const,
      defaultValue: 12, // 12% of basic salary
      editable: false,
    },
    {
      id: "tax",
      name: "Income Tax",
      type: "calculated" as const,
      defaultValue: 0, // Calculated based on tax slabs
      editable: false,
    },
    {
      id: "insurance",
      name: "Health Insurance",
      type: "fixed" as const,
      defaultValue: 1000,
      editable: true,
    },
  ],
};

export const dummyPayrollData = [
  {
    employeeId: "EMP001",
    name: "John Doe",
    designation: "Senior Developer",
    ctc: 1200000, // Annual CTC
    monthlyPayroll: {
      month: "March",
      year: 2024,
      earnings: {
        basic: 50000,
        hra: 20000,
        specialAllowance: 15000,
      },
      deductions: {
        pf: 6000,
        tax: 8000,
        insurance: 1000,
      },
      netPayable: 70000,
    },
  },
  // Add more dummy employees...
];
