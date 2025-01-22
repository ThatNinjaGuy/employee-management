"use client";
import { useState } from "react";
import { Employee, MonthlyPayroll, PayrollConfig } from "@/types/payroll";

interface PayrollCardProps {
  employee: Employee;
  payrollConfig: PayrollConfig;
  onUpdate?: (employeeId: string, updatedPayroll: MonthlyPayroll) => void;
  isEditing: boolean;
  onEditClick: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function PayrollCard({
  employee,
  payrollConfig,
  onUpdate,
  isEditing,
  onEditClick,
  onSave,
  onCancel,
}: PayrollCardProps) {
  const [editedPayroll, setEditedPayroll] = useState(employee.monthlyPayroll);

  const handleValueChange = (
    category: "earnings" | "deductions",
    componentId:
      | keyof MonthlyPayroll["earnings"]
      | keyof MonthlyPayroll["deductions"],
    value: string
  ) => {
    const numValue = Number(value) || 0;
    const newPayroll = {
      ...editedPayroll,
      [category]: {
        ...editedPayroll[category],
        [componentId]: numValue,
      },
    };

    // Calculate net payable
    const totalEarnings = Object.values(newPayroll.earnings).reduce(
      (a, b) => a + b,
      0
    );
    const totalDeductions = Object.values(newPayroll.deductions).reduce(
      (a, b) => a + b,
      0
    );
    newPayroll.netPayable = totalEarnings - totalDeductions;

    setEditedPayroll(newPayroll);
    onUpdate?.(employee.employeeId, newPayroll);
  };

  return (
    <tr className="border-b border-white/10">
      <td className="py-4">
        <div>
          <div className="font-medium text-white">{employee.name}</div>
          <div className="text-sm text-gray-400">{employee.designation}</div>
        </div>
      </td>
      {payrollConfig.earnings.map((component) => (
        <td key={component.id} className="py-4">
          {isEditing ? (
            <input
              type="number"
              value={
                editedPayroll.earnings[
                  component.id as keyof MonthlyPayroll["earnings"]
                ]
              }
              onChange={(e) =>
                handleValueChange(
                  "earnings",
                  component.id as keyof MonthlyPayroll["earnings"],
                  e.target.value
                )
              }
              className="w-full bg-primary-darker text-white px-3 py-1 rounded border border-white/10 text-right"
            />
          ) : (
            <span className="block text-right text-gray-200">
              ₹
              {
                editedPayroll.earnings[
                  component.id as keyof MonthlyPayroll["earnings"]
                ]
              }
            </span>
          )}
        </td>
      ))}
      {payrollConfig.deductions.map((component) => (
        <td key={component.id} className="py-4">
          {isEditing ? (
            <input
              type="number"
              value={
                editedPayroll.deductions[
                  component.id as keyof MonthlyPayroll["deductions"]
                ]
              }
              onChange={(e) =>
                handleValueChange(
                  "deductions",
                  component.id as keyof MonthlyPayroll["deductions"],
                  e.target.value
                )
              }
              className="w-full bg-primary-darker text-white px-3 py-1 rounded border border-white/10 text-right"
            />
          ) : (
            <span className="block text-right text-gray-200">
              ₹
              {
                editedPayroll.deductions[
                  component.id as keyof MonthlyPayroll["deductions"]
                ]
              }
            </span>
          )}
        </td>
      ))}
      <td className="py-4 text-right font-medium text-accent-main">
        ₹{editedPayroll.netPayable}
      </td>
      <td className="py-4">
        {isEditing ? (
          <div className="flex gap-2 justify-end">
            <button
              onClick={onSave}
              className="px-3 py-1 bg-accent-main text-white text-sm rounded hover:bg-accent-light"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-primary-darker text-white text-sm rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onEditClick}
            className="px-3 py-1 bg-accent-main text-white text-sm rounded hover:bg-accent-light"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}
