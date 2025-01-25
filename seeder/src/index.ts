import { db } from "./config/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { employees, employeePayrolls, employeeAttendance } from "./data/dummy";

async function seedEmployees() {
  console.log("Seeding employees...");
  const employeesRef = collection(db, "employees");

  for (const employee of employees) {
    const q = query(employeesRef, where("id", "==", employee.id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(employeesRef, employee);
      console.log(`Added employee: ${employee.name}`);
    } else {
      console.log(`Employee ${employee.name} already exists`);
    }
  }
}

async function seedPayrolls() {
  console.log("Seeding payrolls...");
  const payrollsRef = collection(db, "payrolls");

  for (const payroll of employeePayrolls) {
    const q = query(
      payrollsRef,
      where("employeeId", "==", payroll.employeeId),
      where("month", "==", payroll.month)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(payrollsRef, payroll);
      console.log(`Added payroll for employee ID: ${payroll.employeeId}`);
    } else {
      console.log(
        `Payroll already exists for employee ID: ${payroll.employeeId}`
      );
    }
  }
}

async function seedAttendance() {
  console.log("Seeding attendance records...");
  const attendanceRef = collection(db, "attendance");

  for (const record of employeeAttendance) {
    const q = query(
      attendanceRef,
      where("employeeId", "==", record.employeeId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(attendanceRef, record);
      console.log(`Added attendance for employee ID: ${record.employeeId}`);
    } else {
      console.log(
        `Attendance already exists for employee ID: ${record.employeeId}`
      );
    }
  }
}

async function seedAll() {
  try {
    await seedEmployees();
    await seedPayrolls();
    await seedAttendance();
    console.log("Data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedAll();
