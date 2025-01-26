import { utils, writeFile } from "xlsx";
import { Employee, EmployeePayroll } from "@/types";

interface PayrollExportData {
  employees: Employee[];
  payrollData: EmployeePayroll[];
}

interface ExportConfig {
  columnWidths: { wch: number }[];
  fileName: string;
}

export function exportPayrollToExcel(
  { employees, payrollData }: PayrollExportData,
  config: ExportConfig
) {
  try {
    const exportData = employees.map((emp) => {
      const payroll = payrollData.find((p) => p.employeeId === emp.id) || {
        basicWage: 0,
        overtime: { hours: 0, amount: 0 },
        allowances: { food: 0, travel: 0 },
        deductions: { advances: 0, other: 0 },
        month: "-",
      };

      const netPayable =
        payroll.basicWage +
        payroll.overtime.amount -
        payroll.allowances.food -
        payroll.allowances.travel -
        payroll.deductions.advances -
        payroll.deductions.other;

      return {
        "Employee Name": emp.name,
        Department: emp.department,
        Position: emp.position,
        Month: payroll.month || "-",
        "Basic Wage": payroll.basicWage || 0,
        "Overtime Hours": payroll.overtime?.hours || 0,
        "Overtime Amount": payroll.overtime?.amount || 0,
        "Food Allowance": payroll.allowances?.food || 0,
        "Travel Allowance": payroll.allowances?.travel || 0,
        "Advances Deduction": payroll.deductions?.advances || 0,
        "Other Deductions": payroll.deductions?.other || 0,
        "Net Payable": netPayable || 0,
      };
    });

    const ws = utils.json_to_sheet(exportData);
    ws["!cols"] = config.columnWidths;

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Payroll Report");

    writeFile(wb, config.fileName);
    return true;
  } catch (error) {
    console.error("Export error:", error);
    return false;
  }
}

interface ExcelExportConfig {
  headers: string[];
  data: (string | number)[][];
  filename: string;
  sheetName: string;
}

export async function excelExport({
  headers,
  data,
  filename,
  sheetName,
}: ExcelExportConfig) {
  try {
    const ws = utils.aoa_to_sheet([headers, ...data]);
    ws["!cols"] = headers.map(() => ({ wch: 15 })); // Set column width

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);

    writeFile(wb, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
}
