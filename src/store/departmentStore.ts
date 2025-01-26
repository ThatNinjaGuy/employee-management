import { create } from "zustand";

interface DepartmentState {
  departments: string[];
  isLoading: boolean;
  error: string | null;
  setDepartments: (departments: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refresh: () => void;
}

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: [],
  isLoading: false,
  error: null,
  setDepartments: (departments) => set({ departments }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  refresh: () => set({ departments: [] }),
}));
