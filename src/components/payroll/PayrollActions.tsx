interface PayrollActionsProps {
  onSearch?: (term: string) => void;
  onDepartmentChange?: (department: string) => void;
}

export function PayrollActions({
  onSearch,
  onDepartmentChange,
}: PayrollActionsProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-accent-main text-white rounded-xl hover:bg-accent-light transition-colors duration-300">
          Generate Payslips
        </button>
        <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors duration-300">
          Export Report
        </button>
      </div>

      <div className="flex gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <input
            type="text"
            placeholder="Search employees..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main placeholder:text-white/50"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <select
          onChange={(e) => onDepartmentChange?.(e.target.value)}
          className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="Human Resources">Human Resources</option>
        </select>
      </div>
    </div>
  );
}
