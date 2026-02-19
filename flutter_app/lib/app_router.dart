import 'package:go_router/go_router.dart';

import 'screens/attendance_screen.dart';
import 'screens/config_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/employees_screen.dart';
import 'screens/payroll_screen.dart';
import 'screens/suppliers_screen.dart';

GoRouter createRouter() {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/employees',
        name: 'employees',
        builder: (context, state) => const EmployeesScreen(),
      ),
      GoRoute(
        path: '/attendance',
        name: 'attendance',
        builder: (context, state) => const AttendanceScreen(),
      ),
      GoRoute(
        path: '/payroll',
        name: 'payroll',
        builder: (context, state) => const PayrollScreen(),
      ),
      GoRoute(
        path: '/suppliers',
        name: 'suppliers',
        builder: (context, state) => const SuppliersScreen(),
      ),
      GoRoute(
        path: '/configure',
        name: 'configure',
        builder: (context, state) => const ConfigScreen(),
      ),
    ],
  );
}
