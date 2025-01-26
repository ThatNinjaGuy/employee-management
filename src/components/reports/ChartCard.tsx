import React from "react";

interface ChartCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ children, className }: ChartCardProps) {
  return (
    <div className={`bg-primary-dark rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}
