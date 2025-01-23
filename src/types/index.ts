export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
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
