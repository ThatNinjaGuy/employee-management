type AttendanceHeaderProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  departments: string[];
};

export function AttendanceHeader({
  selectedDate,
  onDateChange,
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
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

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full ${inputClasses} placeholder:text-white/50`}
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className={`w-full ${inputClasses} appearance-none`}
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
              </select>
            </div>
            <div className="w-full sm:w-auto flex items-center gap-2">
              <label className="text-white/70 whitespace-nowrap">Date:</label>
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
    </div>
  );
}
