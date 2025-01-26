import { Site, Supplier } from "@/types";

type AttendanceHeaderProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  selectedSiteId: string;
  onSiteChange: (siteId: string) => void;
  selectedSupplierId: string;
  onSupplierChange: (supplierId: string) => void;
  departments: string[];
  sites: Site[];
  suppliers: Supplier[];
};

export function AttendanceHeader({
  selectedDate,
  onDateChange,
  searchTerm,
  onSearchChange,
  // selectedDepartment,
  // onDepartmentChange,
  selectedSiteId,
  onSiteChange,
  selectedSupplierId,
  onSupplierChange,
  // departments,
  sites,
  suppliers,
}: AttendanceHeaderProps) {
  const inputClasses =
    "h-12 px-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50";

  return (
    <div className="relative mb-8">
      <div className="absolute inset-x-0 -top-20 -bottom-20 bg-gradient-to-b from-primary-darkest/50 to-transparent backdrop-blur-xl rounded-[3rem]" />
      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center tracking-tight mb-8">
          Attendance Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
          {/* Filters Section - adjusted width */}
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

          {/* Search Section - with minimum width */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full ${inputClasses} placeholder:text-white/50`}
            />
          </div>

          {/* Date Selector Section - fixed width */}
          <div className="w-full sm:w-[180px]">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
