import { Employee, Site, Supplier } from "@/types";
import { useState, useEffect } from "react";
import { useRoles } from "@/hooks/useRoles";

interface EmployeeEditFormProps {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
  sites: Site[];
  suppliers: Supplier[];
  // departments: string[];  // Comment out but keep for reference
}

export function EmployeeEditForm({
  employee,
  onSave,
  onCancel,
  sites,
  suppliers,
}: // departments,  // Comment out but keep for reference
EmployeeEditFormProps) {
  const [formData, setFormData] = useState<Partial<Employee>>(
    employee || {
      name: "",
      email: "",
      position: "",
      // department: "",  // Keep in state but comment out default
      joinDate: new Date().toISOString().slice(0, 10),
      hourlyRate: 0,
      siteId: "",
      supplierId: "",
    }
  );
  const { roles } = useRoles();

  useEffect(() => {
    console.log("Available suppliers:", suppliers);
  }, [suppliers]);

  useEffect(() => {
    console.log("Available sites:", sites);
  }, [sites]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hourlyRate" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // department will be saved as empty/null since we're not setting it
    onSave(formData as Employee);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
          />
        </div>
        {/* <div className="grid grid-cols-2 gap-4"> */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
              required
            >
              <option value="">Select Position</option>
              {roles.map((role: string) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          {/* Comment out department select but keep for reference
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Department
            </label>
            <select
              name="department"
              value={formData.department || ""}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          */}
        {/* </div> */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Site
            </label>
            <select
              name="siteId"
              value={formData.siteId || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Supplier
            </label>
            <select
              name="supplierId"
              value={formData.supplierId || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Join Date
            </label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Hourly Rate
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
              required
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 py-2 rounded-lg bg-accent-main/80 hover:bg-accent-main text-primary-darkest font-medium transition-colors duration-300"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
