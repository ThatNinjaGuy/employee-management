import { db } from "@/config/firebase";
import { Employee } from "@/types";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    try {
      console.log("Fetching employees...");
      const employeesRef = collection(db, "employees");
      const snapshot = await getDocs(employeesRef);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;

        return {
          docId: docId,
          id: data.id,
          name: data.name || "",
          email: data.email || "",
          position: data.position || "",
          department: data.department || "",
          joinDate: data.joinDate || "",
          hourlyRate: Number(data.hourlyRate) || 0,
          siteId: data.siteId || "",
          supplierId: data.supplierId || "",
        } as Employee;
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  async updateEmployee(employee: Employee): Promise<void> {
    try {
      const { docId, ...employeeData } = employee;

      if (docId) {
        const employeeRef = doc(db, "employees", docId);
        await updateDoc(employeeRef, employeeData);
      } else {
        const employeeRef = collection(db, "employees");
        await addDoc(employeeRef, employeeData);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  async deleteEmployee(docId: string): Promise<void> {
    try {
      const employeeRef = doc(db, "employees", docId);
      await deleteDoc(employeeRef);
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  async addEmployee(employee: Employee): Promise<void> {
    try {
      const employeesRef = collection(db, "employees");

      // Add the employee to Firestore with all required fields
      await addDoc(employeesRef, {
        id: employee.id, // Keep the ID as it's required in your structure
        name: employee.name,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        joinDate: employee.joinDate,
        hourlyRate: Number(employee.hourlyRate),
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    }
  },
};
