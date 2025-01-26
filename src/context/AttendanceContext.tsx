"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { EmployeeAttendance, AttendanceRecord } from "@/types";
import { attendanceService } from "@/services/attendanceService";

interface AttendanceContextType {
  employeeAttendance: EmployeeAttendance[];
  setEmployeeAttendance: React.Dispatch<
    React.SetStateAction<EmployeeAttendance[]>
  >;
  loading: boolean;
  error: string | null;
  fetchAttendanceByDate: (date: string) => Promise<void>;
  addAttendanceRecord: (
    employeeId: number,
    record: AttendanceRecord
  ) => Promise<void>;
  updateAttendanceRecord: (
    employeeId: number,
    record: AttendanceRecord
  ) => Promise<void>;
  bulkCheckout: (date: string, checkOutTime: string) => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export function AttendanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [employeeAttendance, setEmployeeAttendance] = useState<
    EmployeeAttendance[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceByDate = useCallback(async (date: string) => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendanceByDate(date);
      setEmployeeAttendance(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch attendance";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAttendanceRecord = useCallback(
    async (employeeId: number, record: AttendanceRecord) => {
      try {
        setLoading(true);
        await attendanceService.addAttendanceRecord(employeeId, record);

        // Update local state
        setEmployeeAttendance((current) => {
          const existingEmployeeIndex = current.findIndex(
            (emp) => emp.employeeId === employeeId
          );

          if (existingEmployeeIndex >= 0) {
            // Update existing employee's attendance
            const updated = [...current];
            updated[existingEmployeeIndex] = {
              ...updated[existingEmployeeIndex],
              attendance: [
                ...updated[existingEmployeeIndex].attendance,
                record,
              ],
            };
            return updated;
          } else {
            // Add new employee attendance
            return [...current, { employeeId, attendance: [record] }];
          }
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add attendance";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAttendanceRecord = useCallback(
    async (employeeId: number, updatedRecord: AttendanceRecord) => {
      try {
        setLoading(true);
        const attendance = employeeAttendance.find(
          (a) => a.employeeId === employeeId
        );

        if (attendance?.docId) {
          await attendanceService.updateAttendanceRecord(
            attendance.docId,
            employeeId,
            updatedRecord
          );

          // Update local state
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
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update attendance";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [employeeAttendance]
  );

  const bulkCheckout = useCallback(
    async (date: string, checkOutTime: string) => {
      try {
        setLoading(true);
        await attendanceService.bulkCheckout(date, checkOutTime);
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
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to perform bulk checkout";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <AttendanceContext.Provider
      value={{
        employeeAttendance,
        setEmployeeAttendance,
        loading,
        error,
        fetchAttendanceByDate,
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
