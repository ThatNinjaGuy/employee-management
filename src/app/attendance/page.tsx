"use client";

import { useState } from "react";
import { attendance as initialAttendance, employees } from "@/data/dummy";
import { Attendance } from "@/types";

export default function AttendancePage() {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <div className="flex gap-4 items-center">
          <label className="font-medium">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {employees.map((employee) => {
          const todayAttendance = filteredAttendance.find(
            (a) => a.employeeId === employee.id
          );

          return (
            <div key={employee.id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{employee.name}</h2>
                  <p className="text-gray-600">{employee.position}</p>
                  {todayAttendance && (
                    <div className="mt-2 space-y-1">
                      <p>
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            todayAttendance.status === "present"
                              ? "text-green-600"
                              : todayAttendance.status === "late"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {todayAttendance.status}
                        </span>
                      </p>
                      <p className="text-sm">
                        Check-in: {todayAttendance.checkIn}
                        {todayAttendance.checkOut && (
                          <> | Check-out: {todayAttendance.checkOut}</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-x-2">
                  {!todayAttendance ? (
                    <>
                      <button
                        onClick={() =>
                          handleMarkAttendance(employee.id, "present")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Present
                      </button>
                      <button
                        onClick={() =>
                          handleMarkAttendance(employee.id, "late")
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                      >
                        Late
                      </button>
                      <button
                        onClick={() =>
                          handleMarkAttendance(employee.id, "absent")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Absent
                      </button>
                    </>
                  ) : (
                    !todayAttendance.checkOut && (
                      <button
                        onClick={() => handleCheckOut(employee.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Check Out
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
