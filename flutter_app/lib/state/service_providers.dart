import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/attendance_service.dart';
import '../services/config_service.dart';
import '../services/employee_service.dart';
import '../services/payroll_service.dart';

final firestoreProvider = Provider<FirebaseFirestore>((ref) {
  return FirebaseFirestore.instance;
});

final employeeServiceProvider = Provider<EmployeeService>((ref) {
  return EmployeeService(ref.watch(firestoreProvider));
});

final attendanceServiceProvider = Provider<AttendanceService>((ref) {
  return AttendanceService(ref.watch(firestoreProvider));
});

final payrollServiceProvider = Provider<PayrollService>((ref) {
  return PayrollService(ref.watch(firestoreProvider));
});

final configServiceProvider = Provider<ConfigService>((ref) {
  return ConfigService(ref.watch(firestoreProvider));
});
