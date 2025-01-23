import { Employee, EmployeePayroll } from "@/types";
import { PayrollConfig } from "@/types";

interface PayrollCardProps {
  employee: Employee;
  payroll?: EmployeePayroll;
  payrollConfig: PayrollConfig;
  isEditing: boolean;
  onEditClick: () => void;
  onSave: (payroll: EmployeePayroll) => void;
  onCancel: () => void;
}

export function PayrollCard({
  employee,
  payroll,
  isEditing,
  onEditClick,
  onSave,
  onCancel,
}: PayrollCardProps) {
  const handleSave = () => {
    if (!payroll) return;
    onSave(payroll);
  };

  const totalAllowances = payroll
    ? payroll.allowances.food + payroll.allowances.travel
    : 0;
  const totalDeductions = payroll
    ? payroll.deductions.advances + payroll.deductions.other
    : 0;

  return (
    <tr className="border-b border-white/10">
      <td className="py-4 px-4">
        <div>
          <div className="font-medium text-white">{employee.name}</div>
          <div className="text-sm text-white/70">{employee.position}</div>
        </div>
      </td>
      <td className="py-4 px-4 text-right text-white/70">
        ₹{payroll?.basicWage || 0}
      </td>
      <td className="py-4 px-4 text-right text-white/70">
        ₹{payroll?.overtime.amount || 0}
        {payroll?.overtime.hours ? (
          <span className="text-sm text-white/50 ml-1">
            ({payroll.overtime.hours}h)
          </span>
        ) : null}
      </td>
      <td className="py-4 px-4 text-right text-white/70">₹{totalAllowances}</td>
      <td className="py-4 px-4 text-right text-white/70">₹{totalDeductions}</td>
      <td className="py-4 px-4 text-right font-medium text-accent-main">
        ₹{payroll?.netPayable || 0}
      </td>
      <td className="py-4 px-4 text-right">
        {isEditing ? (
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-accent-main text-white text-sm rounded-lg hover:bg-accent-light transition-colors duration-300"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onEditClick}
            className="px-3 py-1 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors duration-300"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}
