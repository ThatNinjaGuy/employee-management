import { Employee, Attendance } from "@/types";

export const employees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    position: "Software Engineer",
    department: "Engineering",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    position: "HR Manager",
    department: "Human Resources",
    joinDate: "2022-11-01",
  },
  // Add more dummy employees as needed
];

export const attendance: Attendance[] = [
  {
    id: 1,
    employeeId: 1,
    date: "2024-03-18",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present",
  },
  {
    id: 2,
    employeeId: 2,
    date: "2024-03-18",
    checkIn: "09:30",
    checkOut: "17:30",
    status: "late",
  },
  // Add more attendance records as needed
];
