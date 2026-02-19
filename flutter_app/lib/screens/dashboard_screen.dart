import 'package:flutter/material.dart';
import 'package:flutter_app/models/attendance.dart';
import 'package:flutter_app/models/employee.dart';
import 'package:flutter_app/models/payroll.dart';
import 'package:flutter_app/state/attendance_notifier.dart';
import 'package:flutter_app/state/employee_notifier.dart';
import 'package:flutter_app/state/payroll_notifier.dart';
import 'package:flutter_app/widgets/async_value_widget.dart';
import 'package:flutter_app/widgets/glass_panel.dart';
import 'package:flutter_app/widgets/next_gradient_page.dart';
import 'package:flutter_app/widgets/section_header.dart';
import 'package:flutter_app/widgets/stat_card.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final employees = ref.watch(employeeListProvider);
    final today = DateTime.now();
    final normalizedToday = DateTime(today.year, today.month, today.day);
    final attendance = ref.watch(attendanceForDateProvider(normalizedToday));
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
                _HeroBlock(
                  onNavigate: (route) => context.go(route),
                ),
                const SizedBox(height: 32),
                _NavigationGrid(
                  onNavigate: (route) => context.go(route),
                ),
                const SizedBox(height: 48),
                const SectionHeader(title: 'Key Metrics'),
                const SizedBox(height: 16),
                AsyncValueWidget(
                  value: employees,
                  dataBuilder: (employeeData) => GlassPanel(
                    padding: const EdgeInsets.all(24),
                    child: _MetricGrid(
                      employees: employeeData,
                      attendanceAsync: attendance,
                    ),
                  ),
                ),
                const SizedBox(height: 40),
                SectionHeader(
                  title: 'Recent Payroll',
                  action: Text(
                    'Month: $month',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Colors.white70,
                        ),
                  ),
                ),
                const SizedBox(height: 16),
                AsyncValueWidget(
                  value: payroll,
                  dataBuilder: (payrollData) => GlassPanel(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: _PayrollList(data: payrollData),
                  ),
                ),
                const SizedBox(height: 40),
                const SectionHeader(title: 'Today\'s Attendance'),
                const SizedBox(height: 16),
                AsyncValueWidget(
                  value: attendance,
                  dataBuilder: (attendanceData) => GlassPanel(
                    padding: const EdgeInsets.all(0),
                    child: _AttendanceOverview(
                      attendanceData: attendanceData,
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
}

class _HeroBlock extends StatelessWidget {
  const _HeroBlock({required this.onNavigate});

  final ValueChanged<String> onNavigate;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GlassPanel(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Employee Management System',
            style: theme.textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.w700,
              height: 1.1,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Mirror of the production Next.js experience with gradient surfaces, '
            'intuitive routing, and real-time Firebase data.',
            style: theme.textTheme.titleMedium?.copyWith(
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 16,
            runSpacing: 12,
            children: [
              ElevatedButton.icon(
                onPressed: () => onNavigate('/employees'),
                icon: const Icon(Icons.people_alt),
                label: const Text('View Employees'),
              ),
              OutlinedButton.icon(
                onPressed: () => onNavigate('/attendance'),
                icon: const Icon(Icons.event_available),
                label: const Text('Mark Attendance'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _NavigationGrid extends StatelessWidget {
  const _NavigationGrid({required this.onNavigate});

  final ValueChanged<String> onNavigate;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth >= 900 ? 2 : 1;
        return GridView.builder(
          shrinkWrap: true,
          itemCount: _navCards.length,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 20,
            mainAxisSpacing: 20,
            childAspectRatio: 1.35,
          ),
          itemBuilder: (context, index) {
            final card = _navCards[index];
            return MouseRegion(
              cursor: SystemMouseCursors.click,
                  child: Stack(
                children: [
                  Positioned.fill(
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 350),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: card.gradient,
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(30),
                        boxShadow: [
                          BoxShadow(
                            color: card.gradient.last.withOpacity(0.25),
                            blurRadius: 40,
                            spreadRadius: -10,
                          ),
                        ],
                      ),
                    ),
                  ),
                  GlassPanel(
                    onTap: () => onNavigate(card.route),
                    padding: const EdgeInsets.all(28),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Icon(card.icon, size: 28),
                        ),
                        const SizedBox(height: 18),
                        Text(
                          card.title,
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge
                              ?.copyWith(fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          card.description,
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(color: Colors.white70),
                        ),
                        const Spacer(),
                        Row(
                          children: [
                            Text(
                              'Open',
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(color: Colors.white),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_outward, size: 20),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

class _MetricGrid extends StatelessWidget {
  const _MetricGrid({required this.employees, required this.attendanceAsync});

  final List<Employee> employees;
  final AsyncValue<List<EmployeeAttendance>> attendanceAsync;

  @override
  Widget build(BuildContext context) {
    final totalEmployees = employees.length;
    final avgHourlyRate = employees.isEmpty
        ? 0
        : employees.map((e) => e.hourlyRate).reduce((a, b) => a + b) /
            employees.length;
    final departmentsCount = employees.map((e) => e.department).toSet().length;

    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 900
            ? 4
            : constraints.maxWidth > 600
                ? 2
                : 1;
        return GridView.count(
          crossAxisCount: crossAxisCount,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          childAspectRatio: 1.25,
          children: [
            StatCard(
              title: 'Employees',
              value: totalEmployees.toString(),
              icon: Icons.people_alt,
            ),
            StatCard(
              title: 'Avg Hourly Rate',
              value: NumberFormat.currency(symbol: '₹').format(avgHourlyRate),
              icon: Icons.payments,
              backgroundColor: Colors.green.shade600,
            ),
            StatCard(
              title: 'Departments',
              value: departmentsCount.toString(),
              icon: Icons.apartment,
              backgroundColor: Colors.indigo.shade600,
            ),
            attendanceAsync.when(
              data: (attendanceData) {
                final presentCount = attendanceData.fold<int>(
                  0,
                  (prev, record) =>
                      prev +
                      record.attendance
                          .where(
                            (entry) => entry.status == AttendanceStatus.present,
                          )
                          .length,
                );
                return StatCard(
                  title: 'Present Today',
                  value: '$presentCount',
                  icon: Icons.check_circle,
                  backgroundColor: Colors.teal.shade600,
                );
              },
              loading: () => const StatCard(
                title: 'Loading...',
                value: '--',
                icon: Icons.sync,
              ),
              error: (error, stack) => StatCard(
                title: 'Attendance',
                value: 'Error',
                icon: Icons.error,
                backgroundColor: Colors.redAccent,
              ),
            ),
          ],
        );
      },
    );
  }
}

class _PayrollList extends StatelessWidget {
  const _PayrollList({required this.data});

  final List<EmployeePayroll> data;

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(24),
        child: Center(child: Text('No payroll data for this month.')),
      );
    }

    final currency = NumberFormat.currency(symbol: '₹');
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: data.length,
      separatorBuilder: (_, __) => Divider(
        color: Colors.white.withOpacity(0.1),
        height: 0,
      ),
      itemBuilder: (context, index) {
        final payroll = data[index];
        return ListTile(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          leading: CircleAvatar(
            backgroundColor: Colors.white.withOpacity(0.1),
            child: Text('${payroll.employeeId}'),
          ),
          title: Text('Employee ID: ${payroll.employeeId}'),
          subtitle: Text(
            'Net Payable: ${currency.format(payroll.netPayable)}',
          ),
          trailing: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Overtime: ${payroll.overtimeHours}h'),
              Text(
                'Allowances: ${currency.format(payroll.foodAllowance + payroll.travelAllowance)}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        );
      },
    );
  }
}

class _AttendanceOverview extends StatelessWidget {
  const _AttendanceOverview({required this.attendanceData});

  final List<EmployeeAttendance> attendanceData;

  @override
  Widget build(BuildContext context) {
    if (attendanceData.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(24),
        child: Text('No attendance records for today.'),
      );
    }

    return Column(
      children: attendanceData
          .map(
            (record) => ListTile(
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              leading: CircleAvatar(
                backgroundColor: Colors.indigo,
                child: Text('${record.employeeId}'),
              ),
              title: Text('Employee ID: ${record.employeeId}'),
              subtitle: Text(
                record.attendance
                    .map(
                      (entry) =>
                          '${entry.checkIn ?? '--'} • ${entry.checkOut ?? '--'}',
                    )
                    .join(', '),
              ),
            ),
          )
          .toList(),
    );
  }
}

class _NavCardData {
  const _NavCardData({
    required this.title,
    required this.description,
    required this.icon,
    required this.route,
    required this.gradient,
  });

  final String title;
  final String description;
  final IconData icon;
  final String route;
  final List<Color> gradient;
}

const _navCards = [
  _NavCardData(
    title: 'Employee Management',
    description:
        'View and manage employee information, profiles, and details.',
    icon: Icons.people_alt,
    route: '/employees',
    gradient: [Color(0xFF2563EB), Color(0xFF7C3AED)],
  ),
  _NavCardData(
    title: 'Attendance Management',
    description: 'Track attendance patterns and daily presence.',
    icon: Icons.event_available,
    route: '/attendance',
    gradient: [Color(0xFF10B981), Color(0xFF059669)],
  ),
  _NavCardData(
    title: 'Payroll Management',
    description: 'Generate payroll with allowances, overtime, and deductions.',
    icon: Icons.payments,
    route: '/payroll',
    gradient: [Color(0xFFF97316), Color(0xFFEA580C)],
  ),
  _NavCardData(
    title: 'Supplier Payables',
    description: 'Track due amounts and manage supplier allocations.',
    icon: Icons.storefront,
    route: '/suppliers',
    gradient: [Color(0xFF14B8A6), Color(0xFF0EA5E9)],
  ),
  _NavCardData(
    title: 'Configure System',
    description: 'Maintain departments, roles, sites, and suppliers.',
    icon: Icons.settings_applications,
    route: '/configure',
    gradient: [Color(0xFF818CF8), Color(0xFF6366F1)],
  ),
];
