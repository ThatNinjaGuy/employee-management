import 'package:flutter/material.dart';
import 'package:flutter_app/models/attendance.dart';
import 'package:flutter_app/models/config_models.dart';
import 'package:flutter_app/models/employee.dart';
import 'package:flutter_app/state/attendance_notifier.dart';
import 'package:flutter_app/state/config_notifier.dart';
import 'package:flutter_app/state/employee_notifier.dart';
import 'package:flutter_app/widgets/attendance_employee_card.dart';
import 'package:flutter_app/widgets/glass_panel.dart';
import 'package:flutter_app/widgets/next_gradient_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../widgets/async_value_widget.dart';

class AttendanceScreen extends ConsumerStatefulWidget {
  const AttendanceScreen({super.key});

  @override
  ConsumerState<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends ConsumerState<AttendanceScreen> {
  final TextEditingController _searchController = TextEditingController();
  final Set<int> _selectedEmployees = <int>{};
  final Map<int, AttendanceRecord> _pendingUpdates = <int, AttendanceRecord>{};

  String _departmentFilter = '';
  String _siteFilter = '';
  String _supplierFilter = '';
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final initial = ref.read(selectedAttendanceDateProvider);
    final normalized = _normalize(initial);
    if (initial != normalized) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(selectedAttendanceDateProvider.notifier).state = normalized;
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedDate = ref.watch(selectedAttendanceDateProvider);
    final normalizedDate = _normalize(selectedDate);
    final employees = ref.watch(employeeListProvider);
    final attendance = ref.watch(attendanceForDateProvider(normalizedDate));
    final config = ref.watch(configProvider);

    return NextGradientPage(
      child: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1200),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildHeader(context, normalizedDate),
                    const SizedBox(height: 24),
                    AsyncValueWidget(
                      value: employees,
                      dataBuilder: (employeeData) => AsyncValueWidget(
                        value: attendance,
                        dataBuilder: (attendanceData) => AsyncValueWidget(
                          value: config,
                          dataBuilder: (configData) => _buildAttendanceBody(
                            context: context,
                            employees: employeeData,
                            attendanceData: attendanceData,
                            config: configData,
                            selectedDate: normalizedDate,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 120),
                  ],
                ),
              ),
            ),
          ),
          if (_pendingUpdates.isNotEmpty)
            Positioned(
              right: 24,
              bottom: 24 + MediaQuery.of(context).padding.bottom,
              child: FloatingActionButton.extended(
                onPressed: _isSaving ? null : () => _savePending(normalizedDate),
                backgroundColor: Theme.of(context).colorScheme.secondary,
                foregroundColor: Colors.black,
                icon: _isSaving
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.black,
                        ),
                      )
                    : const Icon(Icons.cloud_upload),
                label: Text(
                  _isSaving
                      ? 'Saving...'
                      : 'Save Changes (${_pendingUpdates.length})',
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, DateTime selectedDate) {
    return GlassPanel(
      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Attendance Management',
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
          ),
          const SizedBox(height: 12),
          Text(
            'Mirror of the original Next.js flow with filters, bulk updates, '
            'and gradient visuals.',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 16,
            runSpacing: 16,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              SizedBox(
                width: 320,
                child: TextField(
                  controller: _searchController,
                  decoration: const InputDecoration(
                    labelText: 'Search employees',
                    prefixIcon: Icon(Icons.search),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
              ),
              OutlinedButton.icon(
                onPressed: () => _pickDate(context, selectedDate),
                icon: const Icon(Icons.calendar_today),
                label: Text(DateFormat.yMMMMd().format(selectedDate)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAttendanceBody({
    required BuildContext context,
    required List<Employee> employees,
    required List<EmployeeAttendance> attendanceData,
    required ConfigData config,
    required DateTime selectedDate,
  }) {
    final attendanceLookup = <int, AttendanceRecord?>{
      for (final record in attendanceData)
        record.employeeId:
            record.attendance.isNotEmpty ? record.attendance.first : null,
    };

    final effectiveAttendance = <int, AttendanceRecord?>{
      ...attendanceLookup,
      ..._pendingUpdates,
    };

    final filteredEmployees = employees.where((employee) {
      final matchesSearch = employee.name
          .toLowerCase()
          .contains(_searchController.text.toLowerCase());
      final matchesDepartment = _departmentFilter.isEmpty ||
          employee.department == _departmentFilter;
      final matchesSite =
          _siteFilter.isEmpty || employee.siteId == _siteFilter;
      final matchesSupplier =
          _supplierFilter.isEmpty || employee.supplierId == _supplierFilter;
      return matchesSearch && matchesDepartment && matchesSite && matchesSupplier;
    }).toList()
      ..sort((a, b) => a.name.compareTo(b.name));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GlassPanel(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: [
                  _FilterDropdown(
                    label: 'Department',
                    value: _departmentFilter,
                    values: config.departments,
                    hint: 'All Departments',
                    onChanged: (value) => setState(() {
                      _departmentFilter = value ?? '';
                    }),
                  ),
                  _FilterDropdown(
                    label: 'Site',
                    value: _siteFilter,
                    values: config.sites.map((site) => site.id).toList(),
                    displayValues: config.sites.map((site) => site.name).toList(),
                    hint: 'All Sites',
                    onChanged: (value) => setState(() {
                      _siteFilter = value ?? '';
                    }),
                  ),
                  _FilterDropdown(
                    label: 'Supplier',
                    value: _supplierFilter,
                    values: config.suppliers.map((supplier) => supplier.id).toList(),
                    displayValues:
                        config.suppliers.map((supplier) => supplier.name).toList(),
                    hint: 'All Suppliers',
                    onChanged: (value) => setState(() {
                      _supplierFilter = value ?? '';
                    }),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        if (filteredEmployees.isEmpty)
          GlassPanel(
            padding: const EdgeInsets.all(24),
            child: Center(
              child: Text(
                'No employees match the selected filters.',
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
          )
        else ...[
          _SelectionBar(
            selectedCount: _selectedEmployees.length,
            allSelected: _selectedEmployees.length == filteredEmployees.length,
            onSelectAll: () => _toggleSelectAll(filteredEmployees),
            onClearSelection: () => setState(() => _selectedEmployees.clear()),
            onBulkMark: (status) =>
                _markSelected(status: status, selectedDate: selectedDate),
          ),
          const SizedBox(height: 20),
          LayoutBuilder(
            builder: (context, constraints) {
              final crossAxisCount = constraints.maxWidth >= 1100
                  ? 3
                  : constraints.maxWidth >= 750
                      ? 2
                      : 1;
              return GridView.builder(
                itemCount: filteredEmployees.length,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: crossAxisCount,
                  crossAxisSpacing: 20,
                  mainAxisSpacing: 20,
                  childAspectRatio: 0.95,
                ),
                itemBuilder: (context, index) {
                  final employee = filteredEmployees[index];
                  final record = effectiveAttendance[employee.id];
                  final isSelected = _selectedEmployees.contains(employee.id);
                  return AttendanceEmployeeCard(
                    employee: employee,
                    attendance: record,
                    isSelected: isSelected,
                    actionsDisabled: _isSaving,
                    onToggleSelection: () => _toggleSelection(employee.id),
                    onMarkStatus: (status) => _markEmployee(
                      employeeId: employee.id,
                      status: status,
                      selectedDate: selectedDate,
                    ),
                  );
                },
              );
            },
          ),
        ],
      ],
    );
  }

  Future<void> _pickDate(BuildContext context, DateTime currentDate) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: currentDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      ref.read(selectedAttendanceDateProvider.notifier).state =
          _normalize(picked);
      setState(() {
        _selectedEmployees.clear();
        _pendingUpdates.clear();
      });
    }
  }

  void _toggleSelection(int employeeId) {
    setState(() {
      if (_selectedEmployees.contains(employeeId)) {
        _selectedEmployees.remove(employeeId);
      } else {
        _selectedEmployees.add(employeeId);
      }
    });
  }

  void _toggleSelectAll(List<Employee> employees) {
    setState(() {
      if (_selectedEmployees.length == employees.length) {
        _selectedEmployees.clear();
      } else {
        _selectedEmployees
          ..clear()
          ..addAll(employees.map((employee) => employee.id));
      }
    });
  }

  void _markEmployee({
    required int employeeId,
    required AttendanceStatus status,
    required DateTime selectedDate,
  }) {
    final normalized = _normalize(selectedDate);
    final now = DateFormat('HH:mm').format(DateTime.now());
    final newRecord = AttendanceRecord(
      id: DateTime.now().millisecondsSinceEpoch,
      date: normalized,
      checkIn: status == AttendanceStatus.absent ? '' : now,
      checkOut: '',
      status: status,
    );

    setState(() {
      _pendingUpdates[employeeId] = newRecord;
    });
  }

  void _markSelected({
    required AttendanceStatus status,
    required DateTime selectedDate,
  }) {
    if (_selectedEmployees.isEmpty) return;
    for (final employeeId in _selectedEmployees) {
      _markEmployee(
        employeeId: employeeId,
        status: status,
        selectedDate: selectedDate,
      );
    }
    setState(() {
      _selectedEmployees.clear();
    });
  }

  Future<void> _savePending(DateTime selectedDate) async {
    if (_pendingUpdates.isEmpty) return;
    setState(() => _isSaving = true);
    final notifier = ref.read(attendanceForDateProvider(selectedDate).notifier);

    try {
      await Future.wait(
        _pendingUpdates.entries.map(
          (entry) => notifier.addOrUpdateRecord(
            employeeId: entry.key,
            record: entry.value,
          ),
        ),
      );
      if (!mounted) return;
      setState(() {
        _pendingUpdates.clear();
        _selectedEmployees.clear();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Attendance saved successfully.')),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to save attendance: $error')),
      );
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  DateTime _normalize(DateTime date) =>
      DateTime(date.year, date.month, date.day);
}

class _FilterDropdown extends StatelessWidget {
  const _FilterDropdown({
    required this.label,
    required this.value,
    required this.values,
    this.displayValues,
    this.onChanged,
    this.hint,
    this.enabled = true,
  });

  final String label;
  final String value;
  final List<String> values;
  final List<String>? displayValues;
  final ValueChanged<String?>? onChanged;
  final String? hint;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 220,
      child: DropdownButtonFormField<String>(
        value: value.isEmpty ? '' : value,
        onChanged: enabled ? onChanged : null,
        decoration: InputDecoration(labelText: label),
        items: [
          DropdownMenuItem(
            value: '',
            child: Text(hint ?? 'All'),
          ),
          ...values.asMap().entries.map(
                (entry) => DropdownMenuItem(
                  value: entry.value,
                  child: Text(displayValues?[entry.key] ?? entry.value),
                ),
              ),
        ],
      ),
    );
  }
}

class _SelectionBar extends StatelessWidget {
  const _SelectionBar({
    required this.selectedCount,
    required this.allSelected,
    required this.onSelectAll,
    required this.onClearSelection,
    required this.onBulkMark,
  });

  final int selectedCount;
  final bool allSelected;
  final VoidCallback onSelectAll;
  final VoidCallback onClearSelection;
  final void Function(AttendanceStatus status) onBulkMark;

  @override
  Widget build(BuildContext context) {
    return GlassPanel(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              ElevatedButton.icon(
                onPressed: onSelectAll,
                icon: Icon(allSelected ? Icons.clear_all : Icons.done_all),
                label: Text(allSelected ? 'Deselect All' : 'Select All'),
              ),
              const SizedBox(width: 16),
              Text(
                selectedCount == 0
                    ? 'No employees selected'
                    : '$selectedCount employee${selectedCount == 1 ? '' : 's'} selected',
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(color: Colors.white70),
              ),
              const Spacer(),
              if (selectedCount > 0)
                TextButton(
                  onPressed: onClearSelection,
                  child: const Text('Clear'),
                ),
            ],
          ),
          if (selectedCount > 0) ...[
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _BulkActionButton(
                  label: 'Mark Present',
                  color: Colors.greenAccent,
                  icon: Icons.check_circle,
                  onPressed: () => onBulkMark(AttendanceStatus.present),
                ),
                _BulkActionButton(
                  label: 'Mark Late',
                  color: Colors.amberAccent,
                  icon: Icons.schedule,
                  onPressed: () => onBulkMark(AttendanceStatus.late),
                ),
                _BulkActionButton(
                  label: 'Mark Absent',
                  color: Colors.redAccent,
                  icon: Icons.cancel,
                  onPressed: () => onBulkMark(AttendanceStatus.absent),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _BulkActionButton extends StatelessWidget {
  const _BulkActionButton({
    required this.label,
    required this.color,
    required this.icon,
    required this.onPressed,
  });

  final String label;
  final Color color;
  final IconData icon;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: color.withOpacity(0.15),
        foregroundColor: color,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      ),
      icon: Icon(icon),
      label: Text(label),
    );
  }
}
