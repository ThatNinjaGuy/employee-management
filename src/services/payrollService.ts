import { db } from "@/config/firebase";
import { EmployeePayroll } from "@/types";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export const payrollService = {
  async getPayrollData(): Promise<EmployeePayroll[]> {
    try {
      const payrollRef = collection(db, "payrolls");
      const snapshot = await getDocs(payrollRef);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as EmployeePayroll)
      );
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      throw error;
    }
  },

  async getPayrollByMonth(month: string): Promise<EmployeePayroll[]> {
    try {
      const payrollRef = collection(db, "payrolls");
      const q = query(payrollRef, where("month", "==", month));
      const snapshot = await getDocs(q);

      const payrolls = snapshot.docs.map((doc) => {
        const data = doc.data();
        const payroll: EmployeePayroll = {
          id: doc.id,
          employeeId: data.employeeId,
          month: data.month,
          basicWage: Number(data.basicWage),
          overtime: {
            hours: Number(data.overtime.hours),
            amount: Number(data.overtime.amount),
          },
          allowances: {
            food: Number(data.allowances.food),
            travel: Number(data.allowances.travel),
          },
          deductions: {
            advances: Number(data.deductions.advances),
            other: Number(data.deductions.other),
          },
          advances: {
            taken: Number(data.advances.taken),
            recovered: Number(data.advances.recovered),
            balance: Number(data.advances.balance),
          },
          netPayable: Number(data.netPayable),
        };
        return payroll;
      });

      return payrolls;
    } catch (error) {
      console.error("Error in getPayrollByMonth:", error);
      throw error;
    }
  },

  async updatePayroll(payroll: EmployeePayroll): Promise<void> {
    try {
      const { id, ...payrollData } = payroll;
      if (id) {
        const payrollRef = doc(db, "payrolls", id);
        await updateDoc(payrollRef, payrollData);
      } else {
        const payrollRef = collection(db, "payrolls");
        await addDoc(payrollRef, payrollData);
      }
    } catch (error) {
      console.error("Error updating payroll:", error);
      throw error;
    }
  },

  async deletePayroll(id: string): Promise<void> {
    const payrollRef = doc(db, "payrolls", id);
    await deleteDoc(payrollRef);
  },
};
