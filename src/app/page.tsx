import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Employee Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/employees"
          className="p-6 border rounded-lg hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Employee Management</h2>
          <p>View and manage employee information</p>
        </Link>
        <Link
          href="/attendance"
          className="p-6 border rounded-lg hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Attendance Management</h2>
          <p>Track and manage employee attendance</p>
        </Link>
      </div>
    </div>
  );
}
