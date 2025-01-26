interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  departments: string[];
  onAddEmployee: () => void;
}

export function EmployeeFilters({
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  departments,
  onAddEmployee,
}: EmployeeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
      <div className="w-full sm:w-48">
        <select
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
        </select>
      </div>
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
        />
      </div>
      <div className="w-full sm:w-auto">
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
