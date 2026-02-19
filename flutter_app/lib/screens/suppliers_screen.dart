import 'package:flutter/material.dart';
import 'package:flutter_app/models/config_models.dart';
import 'package:flutter_app/models/employee.dart';
import 'package:flutter_app/state/config_notifier.dart';
import 'package:flutter_app/state/employee_notifier.dart';
import 'package:flutter_app/state/service_providers.dart';
import 'package:flutter_app/widgets/async_value_widget.dart';
import 'package:flutter_app/widgets/glass_panel.dart';
import 'package:flutter_app/widgets/next_gradient_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SuppliersScreen extends ConsumerWidget {
  const SuppliersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final config = ref.watch(configProvider);
    final employees = ref.watch(employeeListProvider);

    return NextGradientPage(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _SuppliersHero(
                  onAddSupplier: () => _openSupplierDialog(context, ref),
                ),
                const SizedBox(height: 24),
                AsyncValueWidget(
                  value: config,
                  dataBuilder: (configData) => AsyncValueWidget(
                    value: employees,
                    dataBuilder: (employeeData) => Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _SupplierMetrics(
                          supplierCount: configData.suppliers.length,
                          assignedEmployees: employeeData
                              .where((employee) => employee.supplierId != null)
                              .length,
                        ),
                        const SizedBox(height: 24),
                        _SuppliersList(
                          suppliers: configData.suppliers,
                          employees: employeeData,
                          onDelete: (supplier) =>
                              _deleteSupplier(context, ref, supplier),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _openSupplierDialog(BuildContext context, WidgetRef ref) async {
    final nameController = TextEditingController();
    await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF0F172A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Add Supplier'),
        content: TextField(
          controller: nameController,
          decoration: const InputDecoration(labelText: 'Supplier Name'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final notifier = ref.read(configProvider.notifier);
              final current = ref.read(configProvider).valueOrNull;
              final suppliers = List<Supplier>.from(current?.suppliers ?? []);
              final id = ref.read(configServiceProvider).generateId();
              suppliers.add(Supplier(id: id, name: nameController.text));
              await notifier.updateSuppliers(suppliers);
              if (context.mounted) Navigator.pop(context);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteSupplier(
    BuildContext context,
    WidgetRef ref,
    Supplier supplier,
  ) async {
    final notifier = ref.read(configProvider.notifier);
    final suppliers = List<Supplier>.from(
      ref.read(configProvider).valueOrNull?.suppliers ?? [],
    )..removeWhere((item) => item.id == supplier.id);
    await notifier.updateSuppliers(suppliers);
  }
}

class _SuppliersHero extends StatelessWidget {
  const _SuppliersHero({required this.onAddSupplier});

  final VoidCallback onAddSupplier;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GlassPanel(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Suppliers & Payables',
            style: theme.textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.w700,
              height: 1.1,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Recreated gradient hero with glow + CTA from the Next.js suppliers page.',
            style: theme.textTheme.titleMedium?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: onAddSupplier,
            icon: const Icon(Icons.add),
            label: const Text('Add Supplier'),
          ),
        ],
      ),
    );
  }
}

class _SupplierMetrics extends StatelessWidget {
  const _SupplierMetrics({
    required this.supplierCount,
    required this.assignedEmployees,
  });

  final int supplierCount;
  final int assignedEmployees;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 16,
      runSpacing: 16,
      children: [
        _MetricCard(
          label: 'Suppliers',
          value: '$supplierCount',
          icon: Icons.storefront,
          gradient: const [Color(0xFF38BDF8), Color(0xFF6366F1)],
        ),
        _MetricCard(
          label: 'Assigned Employees',
          value: '$assignedEmployees',
          icon: Icons.people_alt,
          gradient: const [Color(0xFF10B981), Color(0xFF059669)],
        ),
      ],
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.gradient,
  });

  final String label;
  final String value;
  final IconData icon;
  final List<Color> gradient;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 260,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: LinearGradient(
          colors: gradient,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.white, size: 28),
          const SizedBox(height: 16),
          Text(
            label,
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
          ),
        ],
      ),
    );
  }
}

class _SuppliersList extends StatelessWidget {
  const _SuppliersList({
    required this.suppliers,
    required this.employees,
    required this.onDelete,
  });

  final List<Supplier> suppliers;
  final List<Employee> employees;
  final void Function(Supplier supplier) onDelete;

  @override
  Widget build(BuildContext context) {
    if (suppliers.isEmpty) {
      return GlassPanel(
        padding: const EdgeInsets.all(32),
        child: Center(
          child: Text(
            'No suppliers configured yet.',
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
      );
    }

    return GlassPanel(
      padding: const EdgeInsets.all(0),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: suppliers.length,
        separatorBuilder: (_, __) => Divider(
          height: 0,
          color: Colors.white.withOpacity(0.08),
        ),
        itemBuilder: (context, index) {
          final supplier = suppliers[index];
          final assignedEmployees = employees
              .where((employee) => employee.supplierId == supplier.id)
              .length;
          return ListTile(
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            title: Text(supplier.name),
            subtitle: Text(
              '$assignedEmployees employee(s) assigned',
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: Colors.white70),
            ),
            trailing: IconButton(
              icon: const Icon(Icons.delete_outline),
              onPressed: () => onDelete(supplier),
            ),
          );
        },
      ),
    );
  }
}

