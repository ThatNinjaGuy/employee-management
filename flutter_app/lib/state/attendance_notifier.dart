import 'package:flutter_app/models/attendance.dart';
import 'package:flutter_app/state/service_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final selectedAttendanceDateProvider = StateProvider<DateTime>(
  (ref) => DateTime.now(),
);

final attendanceForDateProvider =
    AsyncNotifierProviderFamily<
      AttendanceForDateNotifier,
      List<EmployeeAttendance>,
      DateTime
    >(AttendanceForDateNotifier.new);

class AttendanceForDateNotifier
    extends FamilyAsyncNotifier<List<EmployeeAttendance>, DateTime> {
  @override
  Future<List<EmployeeAttendance>> build(DateTime arg) async {
    final service = ref.watch(attendanceServiceProvider);
    return service.fetchAttendanceByDate(arg);
  }

  Future<void> addOrUpdateRecord({
    required int employeeId,
    required AttendanceRecord record,
  }) async {
    final service = ref.read(attendanceServiceProvider);
    await service.addOrUpdateRecord(employeeId: employeeId, newRecord: record);
    ref.invalidateSelf();
  }
}
