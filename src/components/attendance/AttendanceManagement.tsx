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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const departments = Array.from(
    new Set(employees.map((emp) => emp.department))
  );

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment
      ? employee.department === selectedDepartment
      : true;
    return matchesSearch && matchesDepartment;
  });

  const filteredAttendance = attendance.filter((a) => a.date === selectedDate);

  const handleMarkAttendanceForSelected = (
    status: "present" | "absent" | "late"
  ) => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });

    const newAttendances = selectedEmployees.map((employeeId) => ({
      id: attendance.length + employeeId,
      employeeId,
      date: today,
      checkIn: now,
      checkOut: "",
      status,
    }));

    setAttendance([...attendance, ...newAttendances]);
    setSelectedEmployees([]);
  };

  const toggleEmployeeSelection = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

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

  const handleSelectAll = () => {
    const allEmployeeIds = filteredEmployees.map((emp) => emp.id);
    setSelectedEmployees(
      selectedEmployees.length === filteredEmployees.length
        ? []
        : allEmployeeIds
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AttendanceHeader
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
        />

        {/* Selection Status Bar */}
        <div className="mb-6 flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5h16M4 12h16m-7 7h7"
                />
              </svg>
              {selectedEmployees.length === filteredEmployees.length
                ? "Deselect All"
                : "Select All"}
            </button>
            {selectedEmployees.length > 0 && (
              <p className="text-white">
                {selectedEmployees.length} employee
                {selectedEmployees.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {selectedEmployees.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={() => handleMarkAttendanceForSelected("present")}
                className="py-2 px-4 rounded-xl bg-green-500/80 hover:bg-green-500 text-white font-medium transition-colors duration-300"
              >
                Mark Present
              </button>
              <button
                onClick={() => handleMarkAttendanceForSelected("late")}
                className="py-2 px-4 rounded-xl bg-yellow-500/80 hover:bg-yellow-500 text-white font-medium transition-colors duration-300"
              >
                Mark Late
              </button>
              <button
                onClick={() => handleMarkAttendanceForSelected("absent")}
                className="py-2 px-4 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-medium transition-colors duration-300"
              >
                Mark Absent
              </button>
              <button
                onClick={() => setSelectedEmployees([])}
                className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors duration-300"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-main/20 to-accent-light/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <AttendanceCard
                employee={employee}
                attendance={filteredAttendance.find(
                  (a) => a.employeeId === employee.id
                )}
                onMarkAttendance={handleMarkAttendance}
                onCheckOut={handleCheckOut}
                isSelected={selectedEmployees.includes(employee.id)}
                onToggleSelect={() => toggleEmployeeSelection(employee.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
