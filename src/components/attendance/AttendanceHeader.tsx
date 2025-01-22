type AttendanceHeaderProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export function AttendanceHeader({
  selectedDate,
  onDateChange,
}: AttendanceHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Attendance Management</h1>
      <div className="flex gap-4 items-center">
        <label className="font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
    </div>
  );
}
