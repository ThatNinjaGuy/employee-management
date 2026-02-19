import 'package:flutter_app/models/employee.dart';
import 'package:flutter_app/state/service_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final employeeListProvider =
    AsyncNotifierProvider<EmployeeListNotifier, List<Employee>>(
      EmployeeListNotifier.new,
    );

class EmployeeListNotifier extends AsyncNotifier<List<Employee>> {
  @override
  Future<List<Employee>> build() async {
    final service = ref.watch(employeeServiceProvider);
    return service.fetchEmployees();
  }

  Future<void> upsert(Employee employee) async {
    final service = ref.read(employeeServiceProvider);
    await service.saveEmployee(employee);
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => service.fetchEmployees());
  }

  Future<void> remove(Employee employee) async {
    if (employee.docId == null) return;
    final service = ref.read(employeeServiceProvider);
    await service.deleteEmployee(employee.docId!);
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => service.fetchEmployees());
  }
}
