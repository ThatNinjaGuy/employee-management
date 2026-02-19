import 'package:cloud_firestore/cloud_firestore.dart';

class EmployeePayroll {
  EmployeePayroll({
    this.docId,
    required this.employeeId,
    required this.month,
    required this.basicWage,
    required this.overtimeHours,
    required this.overtimeAmount,
    required this.foodAllowance,
    required this.travelAllowance,
    required this.advanceTaken,
    required this.advanceRecovered,
    required this.advanceBalance,
    required this.deductionAdvances,
    required this.deductionOther,
    required this.netPayable,
  });

  final String? docId;
  final int employeeId;
  final String month;
  final double basicWage;
  final double overtimeHours;
  final double overtimeAmount;
  final double foodAllowance;
  final double travelAllowance;
  final double advanceTaken;
  final double advanceRecovered;
  final double advanceBalance;
  final double deductionAdvances;
  final double deductionOther;
  final double netPayable;

  factory EmployeePayroll.fromFirestore(
    DocumentSnapshot<Map<String, dynamic>> doc,
  ) {
    final data = doc.data() ?? <String, dynamic>{};
    final allowances = Map<String, dynamic>.from(
      data['allowances'] as Map? ?? {},
    );
    final overtime = Map<String, dynamic>.from(data['overtime'] as Map? ?? {});
    final advances = Map<String, dynamic>.from(data['advances'] as Map? ?? {});
    final deductions = Map<String, dynamic>.from(
      data['deductions'] as Map? ?? {},
    );
    return EmployeePayroll(
      docId: doc.id,
      employeeId: data['employeeId'] is int
          ? data['employeeId'] as int
          : int.tryParse('${data['employeeId']}') ?? 0,
      month: data['month'] as String? ?? '',
      basicWage: (data['basicWage'] as num?)?.toDouble() ?? 0,
      overtimeHours: (overtime['hours'] as num?)?.toDouble() ?? 0,
      overtimeAmount: (overtime['amount'] as num?)?.toDouble() ?? 0,
      foodAllowance: (allowances['food'] as num?)?.toDouble() ?? 0,
      travelAllowance: (allowances['travel'] as num?)?.toDouble() ?? 0,
      advanceTaken: (advances['taken'] as num?)?.toDouble() ?? 0,
      advanceRecovered: (advances['recovered'] as num?)?.toDouble() ?? 0,
      advanceBalance: (advances['balance'] as num?)?.toDouble() ?? 0,
      deductionAdvances: (deductions['advances'] as num?)?.toDouble() ?? 0,
      deductionOther: (deductions['other'] as num?)?.toDouble() ?? 0,
      netPayable: (data['netPayable'] as num?)?.toDouble() ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'employeeId': employeeId,
      'month': month,
      'basicWage': basicWage,
      'overtime': {'hours': overtimeHours, 'amount': overtimeAmount},
      'allowances': {'food': foodAllowance, 'travel': travelAllowance},
      'advances': {
        'taken': advanceTaken,
        'recovered': advanceRecovered,
        'balance': advanceBalance,
      },
      'deductions': {'advances': deductionAdvances, 'other': deductionOther},
      'netPayable': netPayable,
    };
  }
}
