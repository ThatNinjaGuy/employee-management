import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ValueSetterParams,
  ICellRendererParams,
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  CellStyleModule,
  NumberEditorModule,
  ValidationModule,
  RenderApiModule,
} from "ag-grid-community";
import { EmployeePayroll } from "@/types";
import { useEmployees } from "@/context/EmployeeContext";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/ag-grid-custom.css";
import { useState, useEffect } from "react";

// Register all required modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  CellStyleModule,
  NumberEditorModule,
  ValidationModule,
  RenderApiModule,
]);

interface PayrollGridProps {
  selectedMonth: string;
  payrollData: EmployeePayroll[];
  searchTerm: string;
  selectedDepartment: string;
  selectedSiteId: string;
  selectedSupplierId: string;
  onSavePayroll: (payrolls: EmployeePayroll[]) => Promise<void>;
  disabled: boolean;
}

export function PayrollGrid({
  selectedMonth,
  payrollData,
  searchTerm,
  selectedDepartment,
  selectedSiteId,
  selectedSupplierId,
  onSavePayroll,
  disabled,
}: PayrollGridProps) {
  const { employees } = useEmployees();
  const [localPayrollData, setLocalPayrollData] = useState<EmployeePayroll[]>(
    []
  );

  // Initialize local state with context data
  useEffect(() => {
    const initialData = employees.map((employee) => {
      const existingPayroll = payrollData.find(
        (p) => p.employeeId === employee.id && p.month === selectedMonth
      );

      if (existingPayroll) {
        return existingPayroll;
      }

      return {
        employeeId: employee.id,
        month: selectedMonth,
        basicWage: 0,
        overtime: { hours: 0, amount: 0 },
        allowances: { food: 0, travel: 0 },
        deductions: { advances: 0, other: 0 },
        advances: { taken: 0, recovered: 0, balance: 0 },
        netPayable: 0,
      };
    });
    setLocalPayrollData(initialData);
  }, [selectedMonth, payrollData, employees]);

  const calculateNetPayable = (payroll: EmployeePayroll) => {
    return (
      payroll.basicWage +
      payroll.overtime.amount -
      payroll.allowances.food -
      payroll.allowances.travel -
      payroll.deductions.advances -
      payroll.deductions.other
    );
  };

  const handleValueSetter = (params: ValueSetterParams, field: string) => {
    const newValue = Number(params.newValue);
    if (isNaN(newValue)) return false;

    const updatedData = { ...params.data, [field]: newValue };

    if (field === "overtimeHours") {
      const employee = employees.find((emp) => emp.id === updatedData.id);
      if (employee) {
        updatedData.overtimeAmount = newValue * employee.hourlyRate;
      }
    }

    // Find existing payroll to get the document id
    const existingPayroll = payrollData.find(
      (p) => p.employeeId === updatedData.id && p.month === selectedMonth
    );

    const tempPayroll: EmployeePayroll = {
      id: existingPayroll?.id, // Include the document id if it exists
      employeeId: updatedData.id,
      month: selectedMonth,
      basicWage: updatedData.basicWage || 0,
      overtime: {
        hours: updatedData.overtimeHours || 0,
        amount: updatedData.overtimeAmount || 0,
      },
      allowances: {
        food: updatedData.foodAllowance || 0,
        travel: updatedData.travelAllowance || 0,
      },
      deductions: {
        advances: updatedData.advanceDeductions || 0,
        other: updatedData.otherDeductions || 0,
      },
      advances: {
        taken: updatedData.advanceDeductions || 0,
        recovered: 0,
        balance: updatedData.advanceDeductions || 0,
      },
      netPayable: 0,
    };

    tempPayroll.netPayable = calculateNetPayable(tempPayroll);

    setLocalPayrollData((prev) => {
      const index = prev.findIndex(
        (p) =>
          p.employeeId === tempPayroll.employeeId && p.month === selectedMonth
      );
      if (index === -1) return [...prev, tempPayroll];
      const newData = [...prev];
      newData[index] = tempPayroll;
      return newData;
    });

    params.data[field] = newValue;
    params.data.netPayable = tempPayroll.netPayable;

    if (params.node) {
      params.api.refreshCells({
        rowNodes: [params.node],
        force: true,
      });
    }

    return true;
  };

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: {
      display: "flex",
      alignItems: "center",
    },
  };

  const numericColDef = {
    ...defaultColDef,
    cellStyle: {
      display: "flex",
      alignItems: "center",
    },
  };

  const columnDefs: ColDef[] = [
    {
      field: "name",
      headerName: "Employee",
      editable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="py-2">
          <div className="font-medium mb-1">{params.data.name}</div>
          <div className="text-sm opacity-70">{params.data.position}</div>
        </div>
      ),
    },
    {
      ...numericColDef,
      field: "basicWage",
      headerName: "Basic Wage",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "basicWage"),
    },
    {
      ...numericColDef,
      field: "overtimeHours",
      headerName: "Overtime Hours",
      editable: true,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "overtimeHours"),
    },
    {
      ...numericColDef,
      field: "overtimeAmount",
      headerName: "Overtime Amount",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "overtimeAmount"),
    },
    {
      ...numericColDef,
      field: "foodAllowance",
      headerName: "Food Allowance",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "foodAllowance"),
    },
    {
      ...numericColDef,
      field: "travelAllowance",
      headerName: "Travel Allowance",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "travelAllowance"),
    },
    {
      ...numericColDef,
      field: "advanceDeductions",
      headerName: "Advances",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "advanceDeductions"),
    },
    {
      ...numericColDef,
      field: "otherDeductions",
      headerName: "Other Deductions",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "otherDeductions"),
    },
    {
      field: "netPayable",
      headerName: "Net Payable",
      editable: false,
      valueFormatter: (params) => `₹${params.value}`,
      cellClass: "font-medium text-accent-main",
    },
  ];

  const rowData = employees
    .filter((employee) => {
      const matchesSearch = employee.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment =
        !selectedDepartment || employee.department === selectedDepartment;
      const matchesSite = !selectedSiteId || employee.siteId === selectedSiteId;
      const matchesSupplier =
        !selectedSupplierId || employee.supplierId === selectedSupplierId;
      return (
        matchesSearch && matchesDepartment && matchesSite && matchesSupplier
      );
    })
    .map((employee) => {
      const payroll = localPayrollData.find(
        (p) => p.employeeId === employee.id && p.month === selectedMonth
      ) || {
        employeeId: employee.id,
        month: selectedMonth,
        basicWage: 0,
        overtime: { hours: 0, amount: 0 },
        allowances: { food: 0, travel: 0 },
        deductions: { advances: 0, other: 0 },
        advances: { taken: 0, recovered: 0, balance: 0 },
      };

      return {
        id: employee.id,
        name: employee.name,
        position: employee.position,
        basicWage: payroll.basicWage,
        overtimeHours: payroll.overtime.hours,
        overtimeAmount: payroll.overtime.amount,
        foodAllowance: payroll.allowances.food,
        travelAllowance: payroll.allowances.travel,
        advanceDeductions: payroll.deductions.advances,
        otherDeductions: payroll.deductions.other,
        netPayable: calculateNetPayable(payroll as EmployeePayroll),
      };
    });

  return (
    <div className="relative space-y-4">
      <div
        className="ag-theme-alpine-dark rounded-2xl overflow-hidden backdrop-blur-md border border-white/10"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            ...defaultColDef,
            cellClass: "text-white/90",
            headerClass: "text-white/90",
          }}
          animateRows={true}
          suppressClickEdit={false}
          rowHeight={80}
          headerHeight={48}
          theme="legacy"
        />
      </div>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20">
        <button
          onClick={() => onSavePayroll(localPayrollData)}
          disabled={disabled}
          className={`px-6 py-3 bg-accent-main text-primary-darkest font-medium rounded-lg transition-colors shadow-lg backdrop-blur-sm ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent-light"
          }`}
        >
          Update Payroll
        </button>
      </div>
    </div>
  );
}
