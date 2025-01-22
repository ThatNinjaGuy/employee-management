"use client";
import { useState } from "react";
import { Card } from "@/components/common/Card";

interface PayrollComponent {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "calculated";
  defaultValue: number;
  editable: boolean;
}

interface PayrollConfig {
  earnings: PayrollComponent[];
  deductions: PayrollComponent[];
}

interface MonthlyPayroll {
  month: string;
  year: number;
  earnings: Record<string, number>;
  deductions: Record<string, number>;
  netPayable: number;
}

interface Employee {
  employeeId: string;
  name: string;
  designation: string;
  ctc: number;
  monthlyPayroll: MonthlyPayroll;
}

interface PayrollCardProps {
  employee: Employee;
  payrollConfig: PayrollConfig;
}

export function PayrollCard({ employee, payrollConfig }: PayrollCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {employee.name}
            </h3>
            <p className="text-gray-400">{employee.designation}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent-main hover:text-accent-light"
          >
            {isExpanded ? "Show Less" : "Show Details"}
          </button>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Earnings</h4>
              {payrollConfig.earnings.map((component: any) => (
                <div key={component.id} className="flex justify-between">
                  <span className="text-gray-400">{component.name}</span>
                  <span className="text-white">
                    ₹{employee.monthlyPayroll.earnings[component.id]}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Deductions</h4>
              {payrollConfig.deductions.map((component: any) => (
                <div key={component.id} className="flex justify-between">
                  <span className="text-gray-400">{component.name}</span>
                  <span className="text-white">
                    ₹{employee.monthlyPayroll.deductions[component.id]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-white/10">
          <span className="text-lg font-medium text-white">Net Payable</span>
          <span className="text-xl font-semibold text-accent-main">
            ₹{employee.monthlyPayroll.netPayable}
          </span>
        </div>
      </div>
    </Card>
  );
}
