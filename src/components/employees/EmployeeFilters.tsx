import { Site, Supplier } from "@/types";

interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedSiteId: string;
  setSelectedSiteId: (siteId: string) => void;
  selectedSupplierId: string;
  setSelectedSupplierId: (supplierId: string) => void;
  departments: string[];
  sites: Site[];
  suppliers: Supplier[];
  onAddEmployee: () => void;
}

export function EmployeeFilters({
  searchTerm,
  setSearchTerm,
  //   selectedDepartment,
  //   setSelectedDepartment,
  selectedSiteId,
  setSelectedSiteId,
  selectedSupplierId,
  setSelectedSupplierId,
  //   departments,
  sites,
  suppliers,
  onAddEmployee,
}: EmployeeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
      {/* Filters Section - adjusted width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-5/12">
        {/* <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select> */}

        <select
          value={selectedSiteId}
          onChange={(e) => setSelectedSiteId(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
        >
          <option value="">All Sites</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
        >
          <option value="">All Suppliers</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
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
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
        />
      </div>

      {/* Button Section - fixed width */}
      <div className="w-full sm:w-[180px]">
        <button
          onClick={onAddEmployee}
          className="w-full h-12 px-6 rounded-xl bg-accent-main text-primary-darkest font-medium hover:bg-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent-main/50"
        >
          Add Employee
        </button>
      </div>
    </div>
  );
}
