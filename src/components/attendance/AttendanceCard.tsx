import { Employee, Attendance } from "@/types";
import { AttendanceActions } from "@/components/attendance/AttendanceActions";

type AttendanceCardProps = {
  employee: Employee;
  attendance?: Attendance;
  onMarkAttendance: (
    employeeId: number,
    status: "present" | "absent" | "late"
  ) => void;
  onCheckOut: (employeeId: number) => void;
};

export function AttendanceCard({
  employee,
  attendance,
  onMarkAttendance,
  onCheckOut,
}: AttendanceCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{employee.name}</h2>
          <p className="text-gray-600">{employee.position}</p>
          {attendance && (
            <div className="mt-2 space-y-1">
              <p>
                Status:{" "}
                <span
                  className={`font-semibold ${
                    attendance.status === "present"
                      ? "text-green-600"
                      : attendance.status === "late"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {attendance.status}
                </span>
              </p>
              <p className="text-sm">
                Check-in: {attendance.checkIn}
                {attendance.checkOut && (
                  <> | Check-out: {attendance.checkOut}</>
                )}
              </p>
            </div>
          )}
        </div>
        <AttendanceActions
          employeeId={employee.id}
          attendance={attendance}
          onMarkAttendance={onMarkAttendance}
          onCheckOut={onCheckOut}
        />
      </div>
    </div>
  );
}
