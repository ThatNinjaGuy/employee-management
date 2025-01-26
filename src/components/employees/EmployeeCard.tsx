import { Employee } from "@/types";
import { useSuppliers } from "@/hooks/useSuppliers";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: () => void;
}

export function EmployeeCard({ employee, onEdit }: EmployeeCardProps) {
  const { suppliers } = useSuppliers();

  // Get supplier name from supplierId
  const supplierName = employee.supplierId
    ? suppliers.find((s) => s.id === employee.supplierId)?.name ||
      "Not Assigned"
    : "Not Assigned";

  return (
    <div className="relative flex flex-col p-6 bg-white/10 hover:bg-white/[0.15] backdrop-blur-md rounded-2xl border border-white/10 transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent-main/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-accent-main"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">{employee.name}</h2>
          <p className="text-white/70 text-sm">{employee.position}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <p className="text-white/70 text-sm flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {employee.email}
        </p>
        <p className="text-white/70 text-sm flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {supplierName}
        </p>
        <p className="text-white/70 text-sm flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Joined: {employee.joinDate}
        </p>
      </div>

      <button
        onClick={onEdit}
        className="mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors duration-300"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Edit Profile
      </button>
    </div>
  );
}
