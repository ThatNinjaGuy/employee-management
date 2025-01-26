"use client";

import { useState, useEffect } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { useAttendance } from "@/context/AttendanceContext";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceCard } from "./AttendanceCard";
import { AttendanceRecord } from "@/types";
import { useToast } from "@/context/ToastContext";
import { useDepartments } from "@/hooks/useDepartments";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useSites } from "@/hooks/useSites";

export function AttendanceManagement() {
  const { employees, fetchEmployees } = useEmployees();
  const {
    employeeAttendance,
    loading,
    error,
    fetchAttendanceByDate,
    addAttendanceRecord,
    setEmployeeAttendance,
  } = useAttendance();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<
    Map<number, AttendanceRecord>
  >(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const { departments } = useDepartments();
  const { suppliers } = useSuppliers();
  const { sites } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");

  // Fetch employees and attendance data
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchAttendanceByDate(selectedDate);
  }, [selectedDate, fetchAttendanceByDate]);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment
      ? employee.department === selectedDepartment
      : true;
    const matchesSite = selectedSiteId
      ? employee.siteId === selectedSiteId
      : true;
    const matchesSupplier = selectedSupplierId
      ? employee.supplierId === selectedSupplierId
      : true;
    return matchesSearch && matchesDepartment && matchesSite && matchesSupplier;
  });

  const getAttendanceForDate = (employeeId: number) => {
    const employeeData = employeeAttendance.find(
      (ea) => ea.employeeId === employeeId
    );
    return employeeData?.attendance.find((a) => a.date === selectedDate);
  };

  const handleMarkAttendance = (
    employeeId: number,
    status: "present" | "absent" | "late"
  ) => {
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      date: selectedDate,
      checkIn: status === "absent" ? "" : now,
      checkOut: "",
      status,
    };

    // Store update in pending updates
    setPendingUpdates(new Map(pendingUpdates.set(employeeId, newRecord)));

    // Update local state immediately for UI
    setEmployeeAttendance((current) => {
      const existingEmployeeIndex = current.findIndex(
        (emp) => emp.employeeId === employeeId
      );

      if (existingEmployeeIndex >= 0) {
        const updated = [...current];
        const existingAttendance =
          updated[existingEmployeeIndex].attendance || [];

        // Find if there's an existing record for this date
        const dateIndex = existingAttendance.findIndex(
          (a) => a.date === selectedDate
        );

        if (dateIndex >= 0) {
          existingAttendance[dateIndex] = newRecord;
        } else {
          existingAttendance.push(newRecord);
        }

        updated[existingEmployeeIndex] = {
          ...updated[existingEmployeeIndex],
          attendance: existingAttendance,
        };
        return updated;
      }

      // Handle new employee
      return [
        ...current,
        {
          employeeId,
          attendance: [newRecord],
        },
      ];
    });
  };

  const handleMarkAttendanceForSelected = (
    status: "present" | "absent" | "late"
  ) => {
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });

    selectedEmployees.forEach((employeeId) => {
      const newRecord = {
        id: Date.now() + employeeId,
        date: selectedDate,
        checkIn: status === "absent" ? "" : now,
        checkOut: "",
        status,
      };

      // Add to pending updates instead of immediate firebase update
      setPendingUpdates(new Map(pendingUpdates.set(employeeId, newRecord)));

      // Update local state
      setEmployeeAttendance((current) => {
        const existingEmployeeIndex = current.findIndex(
          (emp) => emp.employeeId === employeeId
        );

        if (existingEmployeeIndex >= 0) {
          const updated = [...current];
          updated[existingEmployeeIndex] = {
            ...updated[existingEmployeeIndex],
            attendance: [newRecord],
          };
          return updated;
        }
        return [...current, { employeeId, attendance: [newRecord] }];
      });
    });
    setSelectedEmployees([]);
  };

  const toggleEmployeeSelection = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleBulkCheckout = async () => {
    try {
      setIsSaving(true); // Show loading state while processing

      // Save all pending attendance records
      const savePromises = Array.from(pendingUpdates.entries()).map(
        ([employeeId, record]) => addAttendanceRecord(employeeId, record)
      );
      await Promise.all(savePromises);

      // Update local state with the pending changes
      setEmployeeAttendance((current) => {
        const updated = [...current];
        pendingUpdates.forEach((record, employeeId) => {
          const existingIndex = updated.findIndex(
            (emp) => emp.employeeId === employeeId
          );
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              attendance: [record],
            };
          } else {
            updated.push({ employeeId, attendance: [record] });
          }
        });
        return updated;
      });

      // Clear pending updates before fetching new data
      setPendingUpdates(new Map());
      showToast("All updates saved successfully", "success");
    } catch (error) {
      console.error("Failed to save updates:", error);
      showToast("Failed to save updates", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAll = () => {
    const allEmployeeIds = filteredEmployees.map((emp) => emp.id);
    setSelectedEmployees(
      selectedEmployees.length === filteredEmployees.length
        ? []
        : allEmployeeIds
    );
  };

  if (loading || isSaving) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-main"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main flex justify-center items-center">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

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
          selectedSiteId={selectedSiteId}
          onSiteChange={setSelectedSiteId}
          selectedSupplierId={selectedSupplierId}
          onSupplierChange={setSelectedSupplierId}
          departments={departments}
          sites={sites}
          suppliers={suppliers}
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
                attendance={getAttendanceForDate(employee.id)}
                onMarkAttendance={handleMarkAttendance}
                isSelected={selectedEmployees.includes(employee.id)}
                onToggleSelect={() => toggleEmployeeSelection(employee.id)}
              />
            </div>
          ))}
        </div>

        {/* Floating Checkout Button */}
        {pendingUpdates.size > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={handleBulkCheckout}
              disabled={isSaving}
              className="group flex items-center gap-2 px-6 py-4 bg-accent-main hover:bg-accent-light text-primary-darkest font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Save Changes ({pendingUpdates.size})
                </>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
