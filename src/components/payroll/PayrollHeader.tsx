import { Site, Supplier } from "@/types";

type PayrollHeaderProps = {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  selectedSiteId: string;
  onSiteChange: (siteId: string) => void;
  selectedSupplierId: string;
  onSupplierChange: (supplierId: string) => void;
  departments: string[];
  sites: Site[];
  suppliers: Supplier[];
  handleExportReport: () => void;
};

export function PayrollHeader({
  selectedMonth,
  onMonthChange,
  searchTerm,
  onSearch,
  // selectedDepartment,
  // onDepartmentChange,
  selectedSiteId,
  onSiteChange,
  selectedSupplierId,
  onSupplierChange,
  // departments,
  sites,
  suppliers,
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
      <div className="relative z-10 max-w-4xl mx-auto py-12 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center tracking-tight mb-8">
          Payroll Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
          {/* Filters Section - reduce width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-5/12">
            {/* <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className={inputClasses}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option
                  key={dept}
                  value={dept}
                  className="text-primary-darkest"
                >
                  {dept}
                </option>
              ))}
            </select> */}

            <select
              value={selectedSiteId}
              onChange={(e) => onSiteChange(e.target.value)}
              className={inputClasses}
            >
              <option value="">All Sites</option>
              {sites.map((site) => (
                <option
                  key={site.id}
                  value={site.id}
                  className="text-primary-darkest"
                >
                  {site.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSupplierId}
              onChange={(e) => onSupplierChange(e.target.value)}
              className={inputClasses}
            >
              <option value="">All Suppliers</option>
              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                  className="text-primary-darkest"
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Section - give more space */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full ${inputClasses} placeholder:text-white/50`}
            />
          </div>

          {/* Month and Export Section - fixed width */}
          <div className="w-full sm:w-[280px] flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className={`flex-1 ${inputClasses}`}
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
