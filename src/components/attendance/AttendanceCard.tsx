import { Employee, Attendance } from "@/types";
import { AttendanceActions } from "./AttendanceActions";

type AttendanceCardProps = {
  employee: Employee;
  attendance?: Attendance;
  onMarkAttendance: (
    employeeId: number,
    status: "present" | "absent" | "late"
  ) => void;
  isSelected: boolean;
  onToggleSelect: () => void;
};

export function AttendanceCard({
  employee,
  attendance,
  onMarkAttendance,
  isSelected,
  onToggleSelect,
}: AttendanceCardProps) {
  return (
    <div
      className={`relative flex flex-col p-6 bg-white/10 hover:bg-white/[0.15] backdrop-blur-md rounded-2xl border ${
        isSelected ? "border-accent-main" : "border-white/10"
      } transition-all duration-300 group`}
      onClick={onToggleSelect}
    >
      <div className="absolute top-4 right-4">
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors duration-300 ${
            isSelected ? "bg-accent-main border-accent-main" : "border-white/30"
          }`}
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-primary-darkest"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent-main/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-accent-main"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">{employee.name}</h2>
          <p className="text-white/70 text-sm">{employee.position}</p>
        </div>
      </div>

      {attendance && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                attendance.status === "present"
                  ? "bg-green-400"
                  : attendance.status === "late"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            />
            <span className="text-white/70 text-sm capitalize">
              {attendance.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <p className="text-white/70 text-sm flex items-center gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Check-in: {attendance.checkIn}
            </p>
            {attendance.checkOut && (
              <p className="text-white/70 text-sm flex items-center gap-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Check-out: {attendance.checkOut}
              </p>
            )}
          </div>
        </div>
      )}

      <AttendanceActions
        employeeId={employee.id}
        attendance={attendance}
        onMarkAttendance={onMarkAttendance}
      />
    </div>
  );
}
