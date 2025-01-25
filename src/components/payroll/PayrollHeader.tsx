interface PayrollHeaderProps {
  selectedMonth: string; // YYYY-MM format
  onMonthChange: (month: string) => void;
  onSearch?: (term: string) => void;
  onDepartmentChange?: (department: string) => void;
  handleExportReport: () => void;
}

export function PayrollHeader({
  selectedMonth,
  onMonthChange,
  onSearch,
  onDepartmentChange,
  handleExportReport,
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

  const inputClasses =
    "h-12 px-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50";

  return (
    <div className="relative mb-8">
      <div className="absolute inset-x-0 -top-20 -bottom-20 bg-gradient-to-b from-primary-darkest/50 to-transparent backdrop-blur-xl rounded-[3rem]" />
      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center tracking-tight mb-8">
          Payroll Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="w-full sm:w-48">
            <select
              onChange={(e) => onDepartmentChange?.(e.target.value)}
              className={`${inputClasses}`}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
          <div className="w-full sm:w-44">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className={inputClasses}
            >
              {months.map(({ value, label }) => (
                <option
                  key={value}
                  value={value}
                  className="text-primary-darkest"
                >
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search employees..."
              onChange={(e) => onSearch?.(e.target.value)}
              className={`w-full ${inputClasses} placeholder:text-white/50`}
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <button
              onClick={() => {
                console.log("Button clicked");
                handleExportReport();
              }}
              className={`w-full ${inputClasses} bg-green-500/30 hover:bg-green-500/50`}
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
