import 'package:flutter_app/models/payroll.dart';
import 'package:flutter_app/state/service_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final selectedPayrollMonthProvider = StateProvider<String>((ref) {
  final now = DateTime.now();
  return '${now.year.toString().padLeft(4, '0')}-${now.month.toString().padLeft(2, '0')}';
});

final payrollForMonthProvider =
    AsyncNotifierProviderFamily<
      PayrollForMonthNotifier,
      List<EmployeePayroll>,
      String
    >(PayrollForMonthNotifier.new);

class PayrollForMonthNotifier
    extends FamilyAsyncNotifier<List<EmployeePayroll>, String> {
  @override
  Future<List<EmployeePayroll>> build(String month) async {
    final service = ref.watch(payrollServiceProvider);
    return service.fetchPayrollForMonth(month);
  }

  Future<void> upsert(EmployeePayroll payroll) async {
    final service = ref.read(payrollServiceProvider);
    await service.savePayroll(payroll);
    ref.invalidateSelf();
  }

  Future<void> remove(EmployeePayroll payroll) async {
    if (payroll.docId == null) return;
    final service = ref.read(payrollServiceProvider);
    await service.deletePayroll(payroll.docId!);
    ref.invalidateSelf();
  }
}
