// Copy only the types we need for seeding
export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
  hourlyRate: number;
}

export interface EmployeePayroll {
  id?: string;
  employeeId: number;
  month: string;
  basicWage: number;
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

export interface EmployeeAttendance {
  employeeId: number;
  attendance: {
    id: number;
    date: string;
    checkIn: string;
    checkOut: string;
    status: "present" | "absent" | "late";
  }[];
}
