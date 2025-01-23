import { Employee } from "@/types";
import { useState } from "react";

interface EmployeeEditFormProps {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export function EmployeeEditForm({
  employee,
  onSave,
  onCancel,
}: EmployeeEditFormProps) {
  const [formData, setFormData] = useState(employee);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
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
