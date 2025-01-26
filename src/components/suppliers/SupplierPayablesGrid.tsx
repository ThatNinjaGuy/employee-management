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
  activeSitesCount: number;
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
    cellClass: "text-white/90 flex items-center",
    headerClass: "text-white/90",
    cellStyle: { display: "flex", alignItems: "center" },
  };

  const numericColDef: ColDef = {
    ...defaultColDef,
    width: 180,
    filter: "agNumberColumnFilter",
    cellClass: "text-white/90",
    cellStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
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
      width: 200,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    },
    {
      ...numericColDef,
      field: "activeSitesCount",
      headerName: "Active Sites",
      width: 200,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    },
    {
      ...numericColDef,
      field: "totalPayable",
      headerName: "Total Payable",
      width: 200,
      valueFormatter: (params) => `₹${params.value.toLocaleString("en-IN")}`,
      cellClass: "font-medium text-accent-main",
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
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
          rowHeight={48}
          headerHeight={48}
          theme="legacy"
        />
      </div>
    </div>
  );
}
