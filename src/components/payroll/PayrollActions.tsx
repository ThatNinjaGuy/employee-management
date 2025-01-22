export function PayrollActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-primary-dark rounded-xl p-6 shadow-lg">
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-accent-main text-white rounded-lg hover:bg-accent-light transition-colors duration-200">
          Generate Payslips
        </button>
        <button className="px-4 py-2 bg-primary-darker text-white rounded-lg border border-white/10 hover:bg-primary-dark/80 transition-colors duration-200">
          Export Report
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees..."
            className="pl-10 pr-4 py-2 bg-primary-darker text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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

        <select className="bg-primary-darker text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main">
          <option value="all">All Departments</option>
          <option value="engineering">Engineering</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Sales</option>
        </select>
      </div>
    </div>
  );
}
