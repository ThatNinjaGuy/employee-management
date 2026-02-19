import 'package:flutter/material.dart';
import 'package:flutter_app/models/config_models.dart';
import 'package:flutter_app/models/employee.dart';
import 'package:flutter_app/state/config_notifier.dart';
import 'package:flutter_app/state/employee_notifier.dart';
import 'package:flutter_app/widgets/async_value_widget.dart';
import 'package:flutter_app/widgets/glass_panel.dart';
import 'package:flutter_app/widgets/next_gradient_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

class EmployeesScreen extends ConsumerStatefulWidget {
  const EmployeesScreen({super.key});

  @override
  ConsumerState<EmployeesScreen> createState() => _EmployeesScreenState();
}

class _EmployeesScreenState extends ConsumerState<EmployeesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _departmentFilter = '';
  String _siteFilter = '';
  String _supplierFilter = '';

  @override
  Widget build(BuildContext context) {
    final employees = ref.watch(employeeListProvider);
    final config = ref.watch(configProvider);

    return NextGradientPage(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _EmployeesHero(
                  onAddEmployee: () => _openEmployeeDialog(context),
                ),
                const SizedBox(height: 24),
                AsyncValueWidget(
                  value: config,
                  dataBuilder: (configData) => Column(
                    children: [
                      _FilterPanel(
                        searchController: _searchController,
                        config: configData,
                        departmentFilter: _departmentFilter,
                        siteFilter: _siteFilter,
                        supplierFilter: _supplierFilter,
                        onDepartmentChanged: (value) =>
                            setState(() => _departmentFilter = value ?? ''),
                        onSiteChanged: (value) =>
                            setState(() => _siteFilter = value ?? ''),
                        onSupplierChanged: (value) =>
                            setState(() => _supplierFilter = value ?? ''),
                        onSearchChanged: () => setState(() {}),
                      ),
                      const SizedBox(height: 24),
                      AsyncValueWidget(
                        value: employees,
                        dataBuilder: (employeeData) => _EmployeesGrid(
                          employees: employeeData,
                          searchTerm: _searchController.text,
                          departmentFilter: _departmentFilter,
                          siteFilter: _siteFilter,
                          supplierFilter: _supplierFilter,
                          onEdit: (employee) =>
                              _openEmployeeDialog(context, employee: employee),
                          onDelete: (employee) => ref
                              .read(employeeListProvider.notifier)
                              .remove(employee),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _openEmployeeDialog(
    BuildContext context, {
    Employee? employee,
  }) async {
    await showDialog(
      context: context,
      builder: (_) => _EmployeeDialog(employee: employee),
    );
  }
}

class _EmployeesHero extends StatelessWidget {
  const _EmployeesHero({required this.onAddEmployee});

  final VoidCallback onAddEmployee;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GlassPanel(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Employee Directory',
            style: theme.textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.w700,
              height: 1.1,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Exact replica of the gradient hero from Next.js with responsive CTA '
            'and Firestore-backed data.',
            style: theme.textTheme.titleMedium?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: onAddEmployee,
            icon: const Icon(Icons.add),
            label: const Text('Add Employee'),
          ),
        ],
      ),
    );
  }
}

class _FilterPanel extends StatelessWidget {
  const _FilterPanel({
    required this.searchController,
    required this.config,
    required this.departmentFilter,
    required this.siteFilter,
    required this.supplierFilter,
    required this.onDepartmentChanged,
    required this.onSiteChanged,
    required this.onSupplierChanged,
    required this.onSearchChanged,
  });

  final TextEditingController searchController;
  final ConfigData config;
  final String departmentFilter;
  final String siteFilter;
  final String supplierFilter;
  final ValueChanged<String?> onDepartmentChanged;
  final ValueChanged<String?> onSiteChanged;
  final ValueChanged<String?> onSupplierChanged;
  final VoidCallback onSearchChanged;

  @override
  Widget build(BuildContext context) {
    return GlassPanel(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            controller: searchController,
            decoration: const InputDecoration(
              labelText: 'Search employees',
              prefixIcon: Icon(Icons.search),
            ),
            onChanged: (_) => onSearchChanged(),
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 16,
            runSpacing: 16,
            children: [
              _DropdownFilter(
                label: 'Department',
                value: departmentFilter,
                values: config.departments,
                hint: 'All Departments',
                onChanged: onDepartmentChanged,
              ),
              _DropdownFilter(
                label: 'Site',
                value: siteFilter,
                values: config.sites.map((site) => site.id).toList(),
                displayValues: config.sites.map((site) => site.name).toList(),
                hint: 'All Sites',
                onChanged: onSiteChanged,
              ),
              _DropdownFilter(
                label: 'Supplier',
                value: supplierFilter,
                values: config.suppliers.map((supplier) => supplier.id).toList(),
                displayValues:
                    config.suppliers.map((supplier) => supplier.name).toList(),
                hint: 'All Suppliers',
                onChanged: onSupplierChanged,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _DropdownFilter extends StatelessWidget {
  const _DropdownFilter({
    required this.label,
    required this.value,
    required this.values,
    required this.onChanged,
    this.displayValues,
    this.hint,
  });

  final String label;
  final String value;
  final List<String> values;
  final List<String>? displayValues;
  final ValueChanged<String?> onChanged;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 240,
      child: DropdownButtonFormField<String>(
        value: value.isEmpty ? '' : value,
        decoration: InputDecoration(labelText: label),
        items: [
          DropdownMenuItem(value: '', child: Text(hint ?? 'All')),
          ...values.asMap().entries.map(
                (entry) => DropdownMenuItem(
                  value: entry.value,
                  child: Text(displayValues?[entry.key] ?? entry.value),
                ),
              ),
        ],
        onChanged: onChanged,
      ),
    );
  }
}

class _EmployeesGrid extends StatelessWidget {
  const _EmployeesGrid({
    required this.employees,
    required this.searchTerm,
    required this.departmentFilter,
    required this.siteFilter,
    required this.supplierFilter,
    required this.onEdit,
    required this.onDelete,
  });

  final List<Employee> employees;
  final String searchTerm;
  final String departmentFilter;
  final String siteFilter;
  final String supplierFilter;
  final void Function(Employee employee) onEdit;
  final void Function(Employee employee) onDelete;

  @override
  Widget build(BuildContext context) {
    final filtered = employees.where((employee) {
      final matchesSearch = employee.name
          .toLowerCase()
          .contains(searchTerm.toLowerCase());
      final matchesDepartment =
          departmentFilter.isEmpty || employee.department == departmentFilter;
      final matchesSite = siteFilter.isEmpty || employee.siteId == siteFilter;
      final matchesSupplier =
          supplierFilter.isEmpty || employee.supplierId == supplierFilter;
      return matchesSearch &&
          matchesDepartment &&
          matchesSite &&
          matchesSupplier;
    }).toList()
      ..sort((a, b) => a.name.compareTo(b.name));

    if (filtered.isEmpty) {
      return GlassPanel(
        padding: const EdgeInsets.all(32),
        child: Center(
          child: Text(
            'No employees match the current filters.',
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
      );
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 1200
            ? 3
            : constraints.maxWidth > 800
                ? 2
                : 1;
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 20,
            mainAxisSpacing: 20,
            childAspectRatio: 1.2,
          ),
          itemCount: filtered.length,
          itemBuilder: (context, index) => _EmployeeCard(
            employee: filtered[index],
            onEdit: () => onEdit(filtered[index]),
            onDelete: () => onDelete(filtered[index]),
          ),
        );
      },
    );
  }
}

class _EmployeeCard extends StatelessWidget {
  const _EmployeeCard({
    required this.employee,
    required this.onEdit,
    required this.onDelete,
  });

  final Employee employee;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: Stack(
        children: [
          Positioned.fill(
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.white.withOpacity(0.06),
                    Colors.white.withOpacity(0.02),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(2),
            child: GlassPanel(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        child: Text(
                          employee.name.isNotEmpty
                              ? employee.name[0].toUpperCase()
                              : '?',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              employee.name,
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              employee.position,
                              style: theme.textTheme.bodySmall
                                  ?.copyWith(color: Colors.white70),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: onEdit,
                        icon: const Icon(Icons.edit, color: Colors.white70),
                      ),
                      IconButton(
                        onPressed: onDelete,
                        icon: const Icon(Icons.delete_outline,
                            color: Colors.white54),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      _InfoChip(label: 'Department', value: employee.department),
                      _InfoChip(
                        label: 'Hourly Rate',
                        value: NumberFormat.currency(symbol: '₹')
                            .format(employee.hourlyRate),
                      ),
                      if (employee.siteId != null)
                        _InfoChip(label: 'Site', value: employee.siteId!),
                      if (employee.supplierId != null)
                        _InfoChip(label: 'Supplier', value: employee.supplierId!),
                    ],
                  ),
                  const Spacer(),
                  Text(
                    'Joined ${DateFormat.yMMMd().format(employee.joinDate)}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.white60,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  const _InfoChip({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.white.withOpacity(0.12)),
      ),
      child: Text(
        '$label: $value',
        style: Theme.of(context).textTheme.bodySmall,
      ),
    );
  }
}

class _EmployeeDialog extends ConsumerStatefulWidget {
  const _EmployeeDialog({this.employee});

  final Employee? employee;

  @override
  ConsumerState<_EmployeeDialog> createState() => _EmployeeDialogState();
}

class _EmployeeDialogState extends ConsumerState<_EmployeeDialog> {
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  late final TextEditingController _positionController;
  late final TextEditingController _departmentController;
  late final TextEditingController _joinDateController;
  late final TextEditingController _hourlyRateController;
  String? _siteId;
  String? _supplierId;

  @override
  void initState() {
    super.initState();
    final employee = widget.employee;
    _nameController = TextEditingController(text: employee?.name ?? '');
    _emailController = TextEditingController(text: employee?.email ?? '');
    _positionController = TextEditingController(text: employee?.position ?? '');
    _departmentController =
        TextEditingController(text: employee?.department ?? '');
    _joinDateController = TextEditingController(
      text: (employee?.joinDate ?? DateTime.now())
          .toIso8601String()
          .split('T')
          .first,
    );
    _hourlyRateController =
        TextEditingController(text: employee?.hourlyRate.toString() ?? '');
    _siteId = employee?.siteId;
    _supplierId = employee?.supplierId;
  }

  @override
  Widget build(BuildContext context) {
    final config = ref.watch(configProvider);
    return AlertDialog(
      backgroundColor: const Color(0xFF0F172A),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      title: Text(
        widget.employee == null ? 'Add Employee' : 'Edit Employee',
      ),
      content: SizedBox(
        width: 520,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Name'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _positionController,
                decoration: const InputDecoration(labelText: 'Position'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _departmentController,
                decoration: const InputDecoration(labelText: 'Department'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _joinDateController,
                decoration: const InputDecoration(
                  labelText: 'Join Date (YYYY-MM-DD)',
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _hourlyRateController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Hourly Rate'),
              ),
              const SizedBox(height: 12),
              config.when(
                data: (data) => Column(
                  children: [
                    DropdownButtonFormField<String>(
                      value: _siteId,
                      decoration: const InputDecoration(labelText: 'Site'),
                      items: data.sites
                          .map(
                            (site) => DropdownMenuItem(
                              value: site.id,
                              child: Text(site.name),
                            ),
                          )
                          .toList(),
                      onChanged: (value) => setState(() => _siteId = value),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _supplierId,
                      decoration: const InputDecoration(labelText: 'Supplier'),
                      items: data.suppliers
                          .map(
                            (supplier) => DropdownMenuItem(
                              value: supplier.id,
                              child: Text(supplier.name),
                            ),
                          )
                          .toList(),
                      onChanged: (value) => setState(() => _supplierId = value),
                    ),
                  ],
                ),
                loading: () => const LinearProgressIndicator(),
                error: (error, stack) => Text('Failed to load config: $error'),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () async {
            final employee = Employee(
              docId: widget.employee?.docId,
              id: widget.employee?.id ?? DateTime.now().millisecondsSinceEpoch,
              name: _nameController.text,
              email: _emailController.text,
              position: _positionController.text,
              department: _departmentController.text,
              joinDate: DateTime.tryParse(_joinDateController.text) ??
                  DateTime.now(),
              hourlyRate: double.tryParse(_hourlyRateController.text) ?? 0,
              siteId: _siteId,
              supplierId: _supplierId,
            );
            await ref.read(employeeListProvider.notifier).upsert(employee);
            if (context.mounted) Navigator.pop(context);
          },
          child: const Text('Save'),
        ),
      ],
    );
  }
}



