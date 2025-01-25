export interface Employee {
  docId?: string;
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
  hourlyRate: number;
}

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late";
}

export interface AttendanceRecord {
  id: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "late" | "absent";
}

export interface EmployeeAttendance {
  employeeId: number;
  attendance: AttendanceRecord[];
}

export interface PayrollComponent {
  id: number;
  name: string;
  type: "earning" | "deduction";
  description: string;
}

export interface PayrollConfig {
  dailyWageRange: {
    skilled: { min: number; max: number };
    semiskilled: { min: number; max: number };
    unskilled: { min: number; max: number };
  };
  overtimeRate: number; // multiplier for overtime hours
  allowances: {
    food: number; // daily food allowance
    travel: number; // daily travel allowance
  };
  advances: {
    maxAmount: number; // maximum advance amount
    recoveryRate: number; // % of salary that can be deducted for advance recovery
  };
}

export interface EmployeePayroll {
  id?: string;
  employeeId: number;
  month: string; // YYYY-MM format
  basicWage: number; // daily wage * working days
  overtime: {
    hours: number;
    amount: number;
  };
  allowances: {
    food: number;
    travel: number;
  };
  deductions: {
    advances: number;
    other: number;
  };
  advances: {
    taken: number;
    recovered: number;
    balance: number;
  };
  netPayable: number;
}
