import { PayrollConfig, PayrollComponent } from "@/types";

export const payrollConfig: PayrollConfig = {
  dailyWageRange: {
    skilled: { min: 850, max: 1200 }, // Mason, Carpenter, etc.
    semiskilled: { min: 650, max: 850 }, // Helper, Painter
    unskilled: { min: 500, max: 650 }, // Labor, Cleaner
  },
  overtimeRate: 2, // 2x for overtime hours
  allowances: {
    food: 100, // ₹100 per day food allowance
    travel: 80, // ₹80 per day travel allowance
  },
  advances: {
    maxAmount: 20000, // Maximum ₹20,000 advance
    recoveryRate: 20, // 20% of salary can be deducted for advance recovery
  },
};

export const payrollComponents: PayrollComponent[] = [
  {
    id: 1,
    name: "Basic Wage",
    type: "earning",
    description: "Daily wage based on skill level * number of working days",
  },
  {
    id: 2,
    name: "Overtime",
    type: "earning",
    description: "2x rate for hours worked beyond standard 8 hours",
  },
  {
    id: 3,
    name: "Food Allowance",
    type: "earning",
    description: "Daily allowance for meals during work days",
  },
  {
    id: 4,
    name: "Travel Allowance",
    type: "earning",
    description: "Daily allowance for travel to work site",
  },
  {
    id: 5,
    name: "Advance Recovery",
    type: "deduction",
    description: "Recovery of advances taken by employee",
  },
  {
    id: 6,
    name: "Tools Damage",
    type: "deduction",
    description: "Deductions for any damage to company tools/equipment",
  },
];

export const skillLevels = ["skilled", "semiskilled", "unskilled"] as const;
