"use client";

import { useState } from "react";
import { attendance as initialAttendance, employees } from "@/data/dummy";
import { Attendance } from "@/types";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceCard } from "./AttendanceCard";

export function AttendanceManagement() {
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleMarkAttendance = (
    employeeId: number,
    status: "present" | "absent" | "late"
  ) => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });

    const newAttendance: Attendance = {
      id: attendance.length + 1,
      employeeId,
      date: today,
      checkIn: now,
      checkOut: "",
      status,
    };

    setAttendance([...attendance, newAttendance]);
  };

  const handleCheckOut = (employeeId: number) => {
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });
    setAttendance(
      attendance.map((record) =>
        record.employeeId === employeeId && record.date === selectedDate
          ? { ...record, checkOut: now }
          : record
      )
    );
  };

  const filteredAttendance = attendance.filter((a) => a.date === selectedDate);

  return (
    <div className="container mx-auto p-4">
      <AttendanceHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <div className="grid gap-4">
        {employees.map((employee) => (
          <AttendanceCard
            key={employee.id}
            employee={employee}
            attendance={filteredAttendance.find(
              (a) => a.employeeId === employee.id
            )}
            onMarkAttendance={handleMarkAttendance}
            onCheckOut={handleCheckOut}
          />
        ))}
      </div>
    </div>
  );
}
