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

  async getRoles(): Promise<string[]> {
    try {
      const configRef = collection(db, "config");
      const rolesQuery = query(configRef, where("type", "==", "roles"));
      const snapshot = await getDocs(rolesQuery);

      if (!snapshot.empty) {
        const rolesDoc = snapshot.docs[0].data();
        return rolesDoc.data as string[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  async updateRoles(roles: string[]): Promise<void> {
    try {
      const configRef = collection(db, "config");
      const rolesQuery = query(configRef, where("type", "==", "roles"));
      const snapshot = await getDocs(rolesQuery);

      if (!snapshot.empty) {
        // Update existing document
        const docRef = doc(db, "config", snapshot.docs[0].id);
        await updateDoc(docRef, {
          data: roles,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new document if doesn't exist
        await addDoc(configRef, {
          type: "roles",
          data: roles,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating roles:", error);
      throw error;
    }
  },
};
