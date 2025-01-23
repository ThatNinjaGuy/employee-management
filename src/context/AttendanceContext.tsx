"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { employeeAttendance as initialAttendance } from "@/data/dummy";
import { EmployeeAttendance, AttendanceRecord } from "@/types";

interface AttendanceContextType {
  employeeAttendance: EmployeeAttendance[];
  addAttendanceRecord: (employeeId: number, record: AttendanceRecord) => void;
  updateAttendanceRecord: (
    employeeId: number,
    record: AttendanceRecord
  ) => void;
  bulkCheckout: (date: string, checkOutTime: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [employeeAttendance, setEmployeeAttendance] =
    useState<EmployeeAttendance[]>(initialAttendance);

  const addAttendanceRecord = (
    employeeId: number,
    record: AttendanceRecord
  ) => {
    setEmployeeAttendance((current) =>
      current.map((emp) =>
        emp.employeeId === employeeId
          ? { ...emp, attendance: [...emp.attendance, record] }
          : emp
      )
    );
  };

  const updateAttendanceRecord = (
    employeeId: number,
    updatedRecord: AttendanceRecord
  ) => {
    setEmployeeAttendance((current) =>
      current.map((emp) =>
        emp.employeeId === employeeId
          ? {
              ...emp,
              attendance: emp.attendance.map((record) =>
                record.id === updatedRecord.id ? updatedRecord : record
              ),
            }
          : emp
      )
    );
  };

  const bulkCheckout = (date: string, checkOutTime: string) => {
    setEmployeeAttendance((current) =>
      current.map((emp) => ({
        ...emp,
        attendance: emp.attendance.map((record) =>
          record.date === date && !record.checkOut
            ? { ...record, checkOut: checkOutTime }
            : record
        ),
      }))
    );
  };

  return (
    <AttendanceContext.Provider
      value={{
        employeeAttendance,
        addAttendanceRecord,
        updateAttendanceRecord,
        bulkCheckout,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}
