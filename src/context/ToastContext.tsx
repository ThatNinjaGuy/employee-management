"use client";

import { createContext, useContext, useCallback, useState } from "react";
import { Toast, ToastType } from "@/components/common/Toast";

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
  toast: { message: string; type: ToastType } | null;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []); // Remove dependencies that might cause re-renders

  const hideToast = useCallback(() => {
    setToast(null);
  }, []); // Remove dependencies that might cause re-renders

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toast }}>
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
