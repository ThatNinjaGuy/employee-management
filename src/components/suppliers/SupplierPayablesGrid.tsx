import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule,
  CellStyleModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/ag-grid-custom.css";

// Register required modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule,
  CellStyleModule,
]);

interface SupplierPayable {
  supplierId: string;
  supplierName: string;
  employeeCount: number;
  totalPayable: number;
  month: string;
}

interface SupplierPayablesGridProps {
  payables: SupplierPayable[];
  searchTerm: string;
}

export function SupplierPayablesGrid({
  payables,
  searchTerm,
}: SupplierPayablesGridProps) {
  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellClass: "text-white/90",
    headerClass: "text-white/90",
  };

  const numericColDef: ColDef = {
    ...defaultColDef,
    width: 150,
    filter: "agNumberColumnFilter",
    cellClass: "text-right text-white/90",
  };

  const columnDefs: ColDef[] = [
    {
      ...defaultColDef,
      field: "supplierName",
      headerName: "Supplier Name",
      flex: 1,
      minWidth: 200,
    },
    {
      ...numericColDef,
      field: "employeeCount",
      headerName: "Employee Count",
      width: 150,
    },
    {
      ...numericColDef,
      field: "totalPayable",
      headerName: "Total Payable",
      width: 180,
      valueFormatter: (params) => `₹${params.value.toLocaleString("en-IN")}`,
      cellClass: "font-medium text-accent-main text-right",
    },
  ];

  const filteredPayables = payables.filter((payable) =>
    payable.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative space-y-4">
      <div
        className="ag-theme-alpine-dark rounded-2xl overflow-hidden backdrop-blur-md border border-white/10"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          rowData={filteredPayables}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          suppressClickEdit={false}
          rowHeight={80}
          headerHeight={48}
          theme="legacy"
        />
      </div>
    </div>
  );
}
