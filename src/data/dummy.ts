import { Employee, EmployeeAttendance, EmployeePayroll } from "@/types";

export const employees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    position: "Software Engineer",
    department: "Engineering",
    joinDate: "2023-01-15",
    hourlyRate: 212.5, // 850/8 * 2 (double rate for overtime)
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    position: "HR Manager",
    department: "Human Resources",
    joinDate: "2022-11-01",
    hourlyRate: 225,
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    position: "Product Manager",
    department: "Product",
    joinDate: "2023-03-20",
    hourlyRate: 225,
  },
  // Add more dummy employees as needed
];

export const employeeAttendance: EmployeeAttendance[] = [
  {
    employeeId: 1,
    attendance: [
      {
        id: 1,
        date: "2024-03-18",
        checkIn: "09:00",
        checkOut: "17:00",
        status: "present",
      },
      {
        id: 2,
        date: "2024-03-19",
        checkIn: "08:55",
        checkOut: "17:30",
        status: "present",
      },
      {
        id: 3,
        date: "2024-03-20",
        checkIn: "09:15",
        checkOut: "17:00",
        status: "late",
      },
    ],
  },
  {
    employeeId: 2,
    attendance: [
      {
        id: 4,
        date: "2024-03-18",
        checkIn: "09:30",
        checkOut: "17:30",
        status: "late",
      },
      {
        id: 5,
        date: "2024-03-19",
        checkIn: "09:00",
        checkOut: "17:00",
        status: "present",
      },
      {
        id: 6,
        date: "2024-03-20",
        checkIn: "09:00",
        checkOut: "16:30",
        status: "absent",
      },
    ],
  },
  {
    employeeId: 3,
    attendance: [
      {
        id: 7,
        date: "2024-03-18",
        checkIn: "09:00",
        checkOut: "16:30",
        status: "present",
      },
      {
        id: 8,
        date: "2024-03-19",
        checkIn: "08:45",
        checkOut: "17:15",
        status: "present",
      },
      {
        id: 9,
        date: "2024-03-20",
        checkIn: "09:00",
        checkOut: "17:00",
        status: "present",
      },
    ],
  },
  // Add more attendance records as needed
];

export const employeePayrolls: EmployeePayroll[] = [
  {
    employeeId: 1,
    month: "2025-01",
    basicWage: 22100, // 26 days * 850 (skilled min wage)
    overtime: {
      hours: 12,
      amount: 2550, // (850/8) * 2 * 12
    },
    allowances: {
      food: 2600, // 26 days * 100
      travel: 2080, // 26 days * 80
    },
    advances: {
      taken: 10000,
      recovered: 2000,
      balance: 8000,
    },
    deductions: {
      advances: 2000,
      other: 500,
    },
    netPayable: 26830, // basic + overtime + allowances - deductions
  },
  // Add more dummy payroll records...
];
