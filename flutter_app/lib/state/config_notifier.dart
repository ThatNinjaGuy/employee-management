import 'package:flutter_app/models/config_models.dart';
import 'package:flutter_app/state/service_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final configProvider = AsyncNotifierProvider<ConfigNotifier, ConfigData>(
  ConfigNotifier.new,
);

class ConfigNotifier extends AsyncNotifier<ConfigData> {
  @override
  Future<ConfigData> build() async {
    final service = ref.watch(configServiceProvider);
    final data = await service.fetchConfig();
    if (data.departments.isEmpty && data.roles.isEmpty) {
      return ConfigData.empty();
    }
    return data;
  }

  Future<void> updateDepartments(List<String> departments) async {
    final service = ref.read(configServiceProvider);
    await service.updateDepartments(departments);
    state = AsyncValue.data(
      (state.valueOrNull ?? ConfigData.empty()).copyWith(
        departments: departments,
      ),
    );
  }

  Future<void> updateRoles(List<String> roles) async {
    final service = ref.read(configServiceProvider);
    await service.updateRoles(roles);
    state = AsyncValue.data(
      (state.valueOrNull ?? ConfigData.empty()).copyWith(roles: roles),
    );
  }

  Future<void> updateSuppliers(List<Supplier> suppliers) async {
    final service = ref.read(configServiceProvider);
    await service.updateSuppliers(suppliers);
    state = AsyncValue.data(
      (state.valueOrNull ?? ConfigData.empty()).copyWith(suppliers: suppliers),
    );
  }

  Future<void> updateSites(List<Site> sites) async {
    final service = ref.read(configServiceProvider);
    await service.updateSites(sites);
    state = AsyncValue.data(
      (state.valueOrNull ?? ConfigData.empty()).copyWith(sites: sites),
    );
  }
}
