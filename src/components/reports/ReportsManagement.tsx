"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ChartCard } from "./ChartCard";
import { useReportData } from "@/hooks/useReportData";

export function ReportsManagement() {
  const { data, loading, error } = useReportData();

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error.message}</div>;
  if (!data) return null;

  const employeeCountOptions: Highcharts.Options = {
    title: {
      text: "Employee Count by Month",
      style: { color: "#ffffff" },
    },
    chart: {
      type: "line",
      backgroundColor: "transparent",
    },
    xAxis: {
      categories: data.employeeCountData.map((item) => item.month),
      labels: { style: { color: "#ffffff" } },
    },
    yAxis: {
      title: {
        text: "Number of Employees",
        style: { color: "#ffffff" },
      },
      labels: { style: { color: "#ffffff" } },
    },
    series: [
      {
        name: "Employees",
        type: "line",
        data: data.employeeCountData.map((item) => item.count),
        color: "#60a5fa",
      },
    ],
    legend: {
      itemStyle: { color: "#ffffff" },
    },
    credits: {
      enabled: false,
    },
  };

  const payablesOptions: Highcharts.Options = {
    title: {
      text: "Net Payables per Month",
      style: { color: "#ffffff" },
    },
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    xAxis: {
      categories: data.payablesData.map((item) => item.month),
      labels: { style: { color: "#ffffff" } },
    },
    yAxis: {
      title: {
        text: "Amount (₹)",
        style: { color: "#ffffff" },
      },
      labels: { style: { color: "#ffffff" } },
    },
    series: [
      {
        name: "Net Payables",
        type: "column",
        data: data.payablesData.map((item) => item.netPayable),
        color: "#34d399",
      },
    ],
    legend: {
      itemStyle: { color: "#ffffff" },
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Reports Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard className="p-4">
          <HighchartsReact
            highcharts={Highcharts}
            options={employeeCountOptions}
          />
        </ChartCard>

        <ChartCard className="p-4">
          <HighchartsReact highcharts={Highcharts} options={payablesOptions} />
        </ChartCard>
      </div>
    </div>
  );
}
