import { EmployeeAttendance } from "@/types";

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

export const departments = [
  "Engineering",
  "Sales",
  "Marketing",
  "Human Resources",
  "Finance",
  "Operations",
  "Product",
  "Design",
];
