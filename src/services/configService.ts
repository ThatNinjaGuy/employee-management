import { db } from "@/config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

export const configService = {
  async getDepartments(): Promise<string[]> {
    try {
      const configRef = collection(db, "config");
      const deptQuery = query(configRef, where("type", "==", "departments"));
      const snapshot = await getDocs(deptQuery);

      if (!snapshot.empty) {
        const deptDoc = snapshot.docs[0].data();
        return deptDoc.data as string[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  },

  async updateDepartments(departments: string[]): Promise<void> {
    try {
      const configRef = collection(db, "config");
      const deptQuery = query(configRef, where("type", "==", "departments"));
      const snapshot = await getDocs(deptQuery);

      if (!snapshot.empty) {
        // Update existing document
        const docRef = doc(db, "config", snapshot.docs[0].id);
        await updateDoc(docRef, {
          data: departments,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new document if doesn't exist
        await addDoc(configRef, {
          type: "departments",
          data: departments,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating departments:", error);
      throw error;
    }
  },
};
