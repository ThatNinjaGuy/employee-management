import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { AttendanceProvider } from "@/context/AttendanceContext";
import { PayrollProvider } from "@/context/PayrollContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Employee Management System",
  description: "Track and manage employee attendance and information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EmployeeProvider>
          <PayrollProvider>
            <AttendanceProvider>{children}</AttendanceProvider>
          </PayrollProvider>
        </EmployeeProvider>
      </body>
    </html>
  );
}
