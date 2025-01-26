type SupplierPayablesHeaderProps = {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  handleExportReport: () => void;
};

export function SupplierPayablesHeader({
  selectedMonth,
  onMonthChange,
  searchTerm,
  onSearch,
  handleExportReport,
}: SupplierPayablesHeaderProps) {
  const inputClasses =
    "h-12 px-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50";

  return (
    <div className="relative mb-8">
      <div className="absolute inset-x-0 -top-20 -bottom-20 bg-gradient-to-b from-primary-darkest/50 to-transparent backdrop-blur-xl rounded-[3rem]" />
      <div className="relative z-10 max-w-4xl mx-auto py-12 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center tracking-tight mb-8">
          Supplier Payables
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full ${inputClasses} placeholder:text-white/50`}
            />
          </div>

          <div className="w-full sm:w-[280px] flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className={`flex-1 ${inputClasses}`}
            >
              {Array.from({ length: 24 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() + i);
                const value = date.toISOString().slice(0, 7);
                const label = date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                });
                return (
                  <option
                    key={value}
                    value={value}
                    className="text-primary-darkest"
                  >
                    {label}
                  </option>
                );
              })}
            </select>
            <button
              onClick={handleExportReport}
              className="h-12 px-4 rounded-xl bg-accent-main text-primary-darkest font-medium hover:bg-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent-main/50"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
