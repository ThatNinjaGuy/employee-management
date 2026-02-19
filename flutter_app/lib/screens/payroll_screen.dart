import 'package:flutter/material.dart';
import 'package:flutter_app/models/payroll.dart';
import 'package:flutter_app/state/payroll_notifier.dart';
import 'package:flutter_app/widgets/async_value_widget.dart';
import 'package:flutter_app/widgets/glass_panel.dart';
import 'package:flutter_app/widgets/next_gradient_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

class PayrollScreen extends ConsumerWidget {
  const PayrollScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final month = ref.watch(selectedPayrollMonthProvider);
    final payroll = ref.watch(payrollForMonthProvider(month));

    return NextGradientPage(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _PayrollHero(
                  month: month,
                  onMonthPick: (newMonth) => ref
                      .read(selectedPayrollMonthProvider.notifier)
                      .state = newMonth,
                  onAddPayroll: () =>
                      _openPayrollDialog(context, ref, month),
                ),
                const SizedBox(height: 24),
                AsyncValueWidget(
                  value: payroll,
                  dataBuilder: (data) => _PayrollTable(
                    month: month,
                    data: data,
                    onEdit: (row) =>
                        _openPayrollDialog(context, ref, month, payroll: row),
                    onDelete: (row) => ref
                        .read(payrollForMonthProvider(month).notifier)
                        .remove(row),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _openPayrollDialog(
    BuildContext context,
    WidgetRef ref,
    String month, {
    EmployeePayroll? payroll,
  }) async {
    await showDialog(
      context: context,
      builder: (_) => _PayrollDialog(month: month, payroll: payroll),
    );
  }
}

class _PayrollHero extends StatelessWidget {
  const _PayrollHero({
    required this.month,
    required this.onMonthPick,
    required this.onAddPayroll,
  });

  final String month;
  final ValueChanged<String> onMonthPick;
  final VoidCallback onAddPayroll;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GlassPanel(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Payroll Management',
            style: theme.textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.w700,
              height: 1.1,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Mirrors the gradient hero from Next.js: change months, add payroll entries, '
            'and review financial details within glass panels.',
            style: theme.textTheme.titleMedium?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 16,
            runSpacing: 12,
            children: [
              OutlinedButton.icon(
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime.parse('$month-01'),
                    firstDate: DateTime(2020),
                    lastDate: DateTime(2100),
                  );
                  if (picked != null) {
                    final newMonth =
                        '${picked.year}-${picked.month.toString().padLeft(2, '0')}';
                    onMonthPick(newMonth);
                  }
                },
                icon: const Icon(Icons.calendar_today),
                label: Text('Month: $month'),
              ),
              ElevatedButton.icon(
                onPressed: onAddPayroll,
                icon: const Icon(Icons.add),
                label: const Text('Add Payroll'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PayrollTable extends StatelessWidget {
  const _PayrollTable({
    required this.month,
    required this.data,
    required this.onEdit,
    required this.onDelete,
  });

  final String month;
  final List<EmployeePayroll> data;
  final void Function(EmployeePayroll payroll) onEdit;
  final void Function(EmployeePayroll payroll) onDelete;

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) {
      return GlassPanel(
        padding: const EdgeInsets.all(32),
        child: Center(
          child: Text(
            'No payroll entries for $month.',
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
      );
    }

    final currency = NumberFormat.currency(symbol: '₹');
    return GlassPanel(
      padding: const EdgeInsets.all(0),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          headingRowColor: MaterialStateProperty.all(
            Colors.white.withOpacity(0.04),
          ),
          columns: const [
            DataColumn(label: Text('Emp ID')),
            DataColumn(label: Text('Basic Wage')),
            DataColumn(label: Text('Overtime')),
            DataColumn(label: Text('Allowances')),
            DataColumn(label: Text('Net Payable')),
            DataColumn(label: Text('Actions')),
          ],
          rows: data
              .map(
                (row) => DataRow(
                  cells: [
                    DataCell(Text('${row.employeeId}')),
                    DataCell(Text(currency.format(row.basicWage))),
                    DataCell(
                      Text(
                        '${row.overtimeHours}h / ${currency.format(row.overtimeAmount)}',
                      ),
                    ),
                    DataCell(
                      Text(
                        currency.format(
                          row.foodAllowance + row.travelAllowance,
                        ),
                      ),
                    ),
                    DataCell(Text(currency.format(row.netPayable))),
                    DataCell(
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit),
                            onPressed: () => onEdit(row),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline),
                            onPressed: () => onDelete(row),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}

class _PayrollDialog extends ConsumerStatefulWidget {
  const _PayrollDialog({required this.month, this.payroll});

  final String month;
  final EmployeePayroll? payroll;

  @override
  ConsumerState<_PayrollDialog> createState() => _PayrollDialogState();
}

class _PayrollDialogState extends ConsumerState<_PayrollDialog> {
  late final TextEditingController _employeeIdController;
  late final TextEditingController _basicWageController;
  late final TextEditingController _overtimeHoursController;
  late final TextEditingController _overtimeAmountController;
  late final TextEditingController _foodAllowanceController;
  late final TextEditingController _travelAllowanceController;
  late final TextEditingController _advanceTakenController;
  late final TextEditingController _advanceRecoveredController;
  late final TextEditingController _advanceBalanceController;
  late final TextEditingController _deductionAdvanceController;
  late final TextEditingController _deductionOtherController;
  late final TextEditingController _netPayableController;

  @override
  void initState() {
    super.initState();
    final payroll = widget.payroll;
    _employeeIdController =
        TextEditingController(text: payroll?.employeeId.toString() ?? '');
    _basicWageController =
        TextEditingController(text: payroll?.basicWage.toString() ?? '');
    _overtimeHoursController =
        TextEditingController(text: payroll?.overtimeHours.toString() ?? '');
    _overtimeAmountController =
        TextEditingController(text: payroll?.overtimeAmount.toString() ?? '');
    _foodAllowanceController =
        TextEditingController(text: payroll?.foodAllowance.toString() ?? '');
    _travelAllowanceController =
        TextEditingController(text: payroll?.travelAllowance.toString() ?? '');
    _advanceTakenController =
        TextEditingController(text: payroll?.advanceTaken.toString() ?? '');
    _advanceRecoveredController =
        TextEditingController(text: payroll?.advanceRecovered.toString() ?? '');
    _advanceBalanceController =
        TextEditingController(text: payroll?.advanceBalance.toString() ?? '');
    _deductionAdvanceController = TextEditingController(
      text: payroll?.deductionAdvances.toString() ?? '',
    );
    _deductionOtherController = TextEditingController(
      text: payroll?.deductionOther.toString() ?? '',
    );
    _netPayableController =
        TextEditingController(text: payroll?.netPayable.toString() ?? '');
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: const Color(0xFF0F172A),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      title: Text(widget.payroll == null ? 'Add Payroll' : 'Edit Payroll'),
      content: SizedBox(
        width: 620,
        child: SingleChildScrollView(
          child: Column(
            children: [
              _numberField(_employeeIdController, 'Employee ID'),
              _numberField(_basicWageController, 'Basic Wage'),
              _numberField(_overtimeHoursController, 'Overtime Hours'),
              _numberField(_overtimeAmountController, 'Overtime Amount'),
              _numberField(_foodAllowanceController, 'Food Allowance'),
              _numberField(_travelAllowanceController, 'Travel Allowance'),
              _numberField(_advanceTakenController, 'Advance Taken'),
              _numberField(_advanceRecoveredController, 'Advance Recovered'),
              _numberField(_advanceBalanceController, 'Advance Balance'),
              _numberField(_deductionAdvanceController, 'Deduction - Advances'),
              _numberField(_deductionOtherController, 'Deduction - Other'),
              _numberField(_netPayableController, 'Net Payable'),
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
            final payroll = EmployeePayroll(
              docId: widget.payroll?.docId,
              employeeId: int.parse(_employeeIdController.text),
              month: widget.month,
              basicWage: double.tryParse(_basicWageController.text) ?? 0,
              overtimeHours:
                  double.tryParse(_overtimeHoursController.text) ?? 0,
              overtimeAmount:
                  double.tryParse(_overtimeAmountController.text) ?? 0,
              foodAllowance:
                  double.tryParse(_foodAllowanceController.text) ?? 0,
              travelAllowance:
                  double.tryParse(_travelAllowanceController.text) ?? 0,
              advanceTaken: double.tryParse(_advanceTakenController.text) ?? 0,
              advanceRecovered:
                  double.tryParse(_advanceRecoveredController.text) ?? 0,
              advanceBalance:
                  double.tryParse(_advanceBalanceController.text) ?? 0,
              deductionAdvances:
                  double.tryParse(_deductionAdvanceController.text) ?? 0,
              deductionOther:
                  double.tryParse(_deductionOtherController.text) ?? 0,
              netPayable: double.tryParse(_netPayableController.text) ?? 0,
            );
            await ref
                .read(payrollForMonthProvider(widget.month).notifier)
                .upsert(payroll);
            if (context.mounted) Navigator.pop(context);
          },
          child: const Text('Save'),
        ),
      ],
    );
  }

  Widget _numberField(TextEditingController controller, String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: TextField(
        controller: controller,
        keyboardType: TextInputType.number,
        decoration: InputDecoration(labelText: label),
      ),
    );
  }
}

