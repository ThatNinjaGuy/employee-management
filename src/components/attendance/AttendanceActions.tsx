import { Attendance } from "@/types";

type AttendanceActionsProps = {
  employeeId: number;
  attendance?: Attendance;
  onMarkAttendance: (
    employeeId: number,
    status: "present" | "absent" | "late"
  ) => void;
  onCheckOut: (employeeId: number) => void;
};

export function AttendanceActions({
  employeeId,
  attendance,
  onMarkAttendance,
  onCheckOut,
}: AttendanceActionsProps) {
  if (!attendance) {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onMarkAttendance(employeeId, "present")}
          className="flex-1 py-2 px-4 rounded-xl bg-green-500/80 hover:bg-green-500 text-white font-medium transition-colors duration-300 flex items-center justify-center gap-2"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Present
        </button>
        <button
          onClick={() => onMarkAttendance(employeeId, "late")}
          className="flex-1 py-2 px-4 rounded-xl bg-yellow-500/80 hover:bg-yellow-500 text-white font-medium transition-colors duration-300 flex items-center justify-center gap-2"
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Late
        </button>
        <button
          onClick={() => onMarkAttendance(employeeId, "absent")}
          className="flex-1 py-2 px-4 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-medium transition-colors duration-300 flex items-center justify-center gap-2"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Absent
        </button>
      </div>
    );
  }

  if (!attendance.checkOut) {
    return (
      <button
        onClick={() => onCheckOut(employeeId)}
        className="w-full py-2 px-4 rounded-xl bg-accent-main/80 hover:bg-accent-main text-primary-darkest font-medium transition-colors duration-300 flex items-center justify-center gap-2"
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
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Check Out
      </button>
    );
  }

  return null;
}
