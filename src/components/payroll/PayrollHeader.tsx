interface PayrollHeaderProps {
  selectedMonth: string;
  selectedYear: number;
  onMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function PayrollHeader({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: PayrollHeaderProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="bg-primary-dark rounded-xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payroll Management</h1>
          <p className="text-gray-400 mt-1">
            Manage employee salaries and compensation
          </p>
        </div>

        <div className="flex gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-primary-darker text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main"
          >
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-primary-darker text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
