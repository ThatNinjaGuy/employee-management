export interface PayrollComponent {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "calculated";
  defaultValue: number;
  editable: boolean;
}

export interface PayrollConfig {
  earnings: PayrollComponent[];
  deductions: PayrollComponent[];
}

export interface MonthlyPayroll {
  month: string;
  year: number;
  earnings: {
    basic: number;
    hra: number;
    specialAllowance: number;
  };
  deductions: {
    pf: number;
    tax: number;
    insurance: number;
  };
  netPayable: number;
}

export interface Employee {
  employeeId: string;
  name: string;
  designation: string;
  ctc: number;
  monthlyPayroll: MonthlyPayroll;
}
