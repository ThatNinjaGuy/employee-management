import { db } from "@/config/firebase";
import { EmployeeAttendance, AttendanceRecord } from "@/types";
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  where,
  getDoc,
} from "firebase/firestore";

export const attendanceService = {
  async getAttendanceByDate(date: string): Promise<EmployeeAttendance[]> {
    try {
      const attendanceRef = collection(db, "attendance");
      const snapshot = await getDocs(attendanceRef);

      return snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            docId: doc.id,
            employeeId: data.employeeId,
            attendance: data.attendance
              .filter((record: AttendanceRecord) => record.date === date)
              .map((record: AttendanceRecord) => ({
                id: record.id,
                date: record.date,
                checkIn: record.checkIn || "",
                checkOut: record.checkOut || "",
                status: record.status,
              })),
          } as EmployeeAttendance;
        })
        .filter((attendance) => attendance.attendance.length > 0);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  },

  async addAttendanceRecord(
    employeeId: number,
    record: AttendanceRecord
  ): Promise<void> {
    try {
      const attendanceRef = collection(db, "attendance");
      const q = query(attendanceRef, where("employeeId", "==", employeeId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Update existing document
        const docRef = doc(db, "attendance", snapshot.docs[0].id);
        const existingData = snapshot.docs[0].data();

        // Check if attendance for this date already exists
        const existingAttendanceIndex = existingData.attendance.findIndex(
          (a: AttendanceRecord) => a.date === record.date
        );

        let updatedAttendance;
        if (existingAttendanceIndex >= 0) {
          // Update existing attendance for this date
          updatedAttendance = existingData.attendance.map(
            (a: AttendanceRecord) => (a.date === record.date ? record : a)
          );
        } else {
          // Add new attendance record
          updatedAttendance = [...existingData.attendance, record];
        }

        await updateDoc(docRef, {
          attendance: updatedAttendance,
        });
      } else {
        // Create new document
        await addDoc(attendanceRef, {
          employeeId,
          attendance: [record],
        });
      }
    } catch (error) {
      console.error("Error adding attendance record:", error);
      throw error;
    }
  },

  async updateAttendanceRecord(
    docId: string,
    employeeId: number,
    record: AttendanceRecord
  ): Promise<void> {
    try {
      const docRef = doc(db, "attendance", docId);
      const snapshot = await getDoc(docRef);
      const data = snapshot.data();

      if (!data) {
        throw new Error("Document not found");
      }

      const updatedAttendance = data.attendance.map((r: AttendanceRecord) =>
        r.id === record.id ? record : r
      );

      await updateDoc(docRef, {
        attendance: updatedAttendance,
      });
    } catch (error) {
      console.error("Error updating attendance record:", error);
      throw error;
    }
  },

  async bulkCheckout(date: string, checkOutTime: string): Promise<void> {
    try {
      const attendanceRef = collection(db, "attendance");
      const snapshot = await getDocs(attendanceRef);

      const updates = snapshot.docs.map((docSnapshot) => {
        const docRef = doc(db, "attendance", docSnapshot.id);
        const data = docSnapshot.data();
        const updatedAttendance = data.attendance.map(
          (record: AttendanceRecord) =>
            record.date === date && !record.checkOut
              ? { ...record, checkOut: checkOutTime }
              : record
        );
        return updateDoc(docRef, { attendance: updatedAttendance });
      });

      await Promise.all(updates);
    } catch (error) {
      console.error("Error performing bulk checkout:", error);
      throw error;
    }
  },
};
