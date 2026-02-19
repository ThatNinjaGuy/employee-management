import 'package:flutter/material.dart';
import 'package:flutter_app/models/attendance.dart';
import 'package:flutter_app/models/employee.dart';

class AttendanceEmployeeCard extends StatelessWidget {
  const AttendanceEmployeeCard({
    super.key,
    required this.employee,
    required this.attendance,
    required this.isSelected,
    required this.onToggleSelection,
    required this.onMarkStatus,
    this.actionsDisabled = false,
  });

  final Employee employee;
  final AttendanceRecord? attendance;
  final bool isSelected;
  final VoidCallback onToggleSelection;
  final void Function(AttendanceStatus status) onMarkStatus;
  final bool actionsDisabled;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final status = attendance?.status;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: isSelected
              ? theme.colorScheme.secondary.withOpacity(0.8)
              : Colors.white.withOpacity(0.12),
          width: 1.4,
        ),
        color: Colors.white.withOpacity(0.08),
        boxShadow: [
          if (isSelected)
            BoxShadow(
              color: theme.colorScheme.secondary.withOpacity(0.35),
              blurRadius: 30,
              spreadRadius: -5,
            ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: theme.colorScheme.secondary.withOpacity(0.15),
                child: Text(
                  employee.name.isNotEmpty
                      ? employee.name.characters.first.toUpperCase()
                      : '?',
                  style: const TextStyle(fontSize: 20),
                ),
              ),
              const SizedBox(width: 16),
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
                    const SizedBox(height: 4),
                    Text(
                      employee.position,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: onToggleSelection,
                icon: Icon(
                  isSelected
                      ? Icons.check_box_rounded
                      : Icons.check_box_outline_blank,
                  color: isSelected
                      ? theme.colorScheme.secondary
                      : Colors.white54,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (status != null) _StatusBadge(status: status),
          if (attendance != null) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 16,
              runSpacing: 8,
              children: [
                _InfoRow(
                  label: 'Check-in',
                  value: attendance?.checkIn ?? '--',
                  icon: Icons.login,
                ),
                _InfoRow(
                  label: 'Check-out',
                  value: attendance?.checkOut?.isNotEmpty == true
                      ? attendance!.checkOut!
                      : '--',
                  icon: Icons.logout,
                ),
              ],
            ),
          ] else
            Text(
              'No attendance recorded for this date.',
              style: theme.textTheme.bodySmall?.copyWith(
                color: Colors.white60,
              ),
            ),
          const Spacer(),
          const SizedBox(height: 16),
          Row(
            children: [
              _ActionButton(
                label: 'Present',
                icon: Icons.check_circle,
                color: Colors.greenAccent,
                onPressed: actionsDisabled
                    ? null
                    : () => onMarkStatus(AttendanceStatus.present),
              ),
              const SizedBox(width: 8),
              _ActionButton(
                label: 'Late',
                icon: Icons.schedule,
                color: Colors.amberAccent,
                onPressed: actionsDisabled
                    ? null
                    : () => onMarkStatus(AttendanceStatus.late),
              ),
              const SizedBox(width: 8),
              _ActionButton(
                label: 'Absent',
                icon: Icons.cancel,
                color: Colors.redAccent,
                onPressed: actionsDisabled
                    ? null
                    : () => onMarkStatus(AttendanceStatus.absent),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});

  final AttendanceStatus status;

  @override
  Widget build(BuildContext context) {
    final color = switch (status) {
      AttendanceStatus.present => Colors.greenAccent,
      AttendanceStatus.late => Colors.amberAccent,
      AttendanceStatus.absent => Colors.redAccent,
    };

    final label = switch (status) {
      AttendanceStatus.present => 'Present',
      AttendanceStatus.late => 'Late',
      AttendanceStatus.absent => 'Absent',
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value, required this.icon});

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 18, color: Colors.white54),
        const SizedBox(width: 6),
        Text(
          '$label: ',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.white60,
                fontWeight: FontWeight.w600,
              ),
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.label,
    required this.icon,
    required this.color,
    required this.onPressed,
  });

  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, size: 18),
        label: Text(label),
        style: ElevatedButton.styleFrom(
          backgroundColor: color.withOpacity(0.15),
          foregroundColor: color,
          elevation: 0,
          padding: const EdgeInsets.symmetric(vertical: 12),
          textStyle: const TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}

