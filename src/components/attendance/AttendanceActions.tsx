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
  return (
    <div className="space-x-2">
      {!attendance ? (
        <>
          <button
            onClick={() => onMarkAttendance(employeeId, "present")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Present
          </button>
          <button
            onClick={() => onMarkAttendance(employeeId, "late")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Late
          </button>
          <button
            onClick={() => onMarkAttendance(employeeId, "absent")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Absent
          </button>
        </>
      ) : (
        !attendance.checkOut && (
          <button
            onClick={() => onCheckOut(employeeId)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Check Out
          </button>
        )
      )}
    </div>
  );
}
