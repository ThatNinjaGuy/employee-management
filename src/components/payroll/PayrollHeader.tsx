interface PayrollHeaderProps {
  selectedMonth: string; // YYYY-MM format
  onMonthChange: (month: string) => void;
}

export function PayrollHeader({
  selectedMonth,
  onMonthChange,
}: PayrollHeaderProps) {
  const currentDate = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), i);
    return {
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleString("default", { month: "long", year: "numeric" }),
    };
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payroll Management</h1>
          <p className="text-white/70 mt-1">
            Manage employee wages and compensation
          </p>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main"
        >
          {months.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
