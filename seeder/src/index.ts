import { db } from "./config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import {
  employees,
  employeePayrolls,
  employeeAttendance,
  departments,
} from "./data/dummy";

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

async function seedDepartments() {
  console.log("Seeding departments...");
  const configRef = collection(db, "config");

  // Check if departments document already exists
  const deptQuery = query(configRef, where("type", "==", "departments"));
  const deptSnapshot = await getDocs(deptQuery);

  if (!deptSnapshot.empty) {
    // Update existing departments
    for (const doc of deptSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
  }

  // Add new departments document
  await addDoc(configRef, {
    type: "departments",
    data: departments,
    updatedAt: new Date().toISOString(),
  });

  console.log("Departments seeded successfully!");
}

async function seedConfigs() {
  console.log("Seeding configurations...");
  try {
    await seedDepartments();
    // Add more config seeding functions here as needed
    console.log("All configurations seeded successfully!");
  } catch (error) {
    console.error("Error seeding configurations:", error);
    throw error; // Propagate error to main seedData function
  }
}

async function seedData() {
  try {
    await seedEmployees();
    await seedPayrolls();
    await seedAttendance();
    await seedConfigs();

    console.log("All data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();
