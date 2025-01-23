interface PayrollHeaderProps {
  selectedMonth: string; // YYYY-MM format
  onMonthChange: (month: string) => void;
}

export function PayrollHeader({
  selectedMonth,
  onMonthChange,
}: PayrollHeaderProps) {
  // Generate an array of the next 24 months from now
  const months = Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i);

    // Format to YYYY-MM and full month name
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const label = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    return { value, label };
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
