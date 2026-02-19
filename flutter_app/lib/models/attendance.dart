import 'package:cloud_firestore/cloud_firestore.dart';

enum AttendanceStatus { present, absent, late }

AttendanceStatus _statusFromString(String? status) {
  switch (status) {
    case 'late':
      return AttendanceStatus.late;
    case 'absent':
      return AttendanceStatus.absent;
    default:
      return AttendanceStatus.present;
  }
}

String attendanceStatusToString(AttendanceStatus status) {
  switch (status) {
    case AttendanceStatus.late:
      return 'late';
    case AttendanceStatus.absent:
      return 'absent';
    case AttendanceStatus.present:
      return 'present';
  }
}

class AttendanceRecord {
  const AttendanceRecord({
    required this.id,
    required this.date,
    this.checkIn,
    this.checkOut,
    required this.status,
  });

  final int id;
  final DateTime date;
  final String? checkIn;
  final String? checkOut;
  final AttendanceStatus status;

  factory AttendanceRecord.fromMap(Map<String, dynamic> data) {
    return AttendanceRecord(
      id: data['id'] is int
          ? data['id'] as int
          : int.tryParse('${data['id']}') ?? 0,
      date: DateTime.tryParse(data['date'] as String? ?? '') ?? DateTime.now(),
      checkIn: data['checkIn'] as String?,
      checkOut: data['checkOut'] as String?,
      status: _statusFromString(data['status'] as String?),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'date': date.toIso8601String().split('T').first,
      'checkIn': checkIn,
      'checkOut': checkOut,
      'status': attendanceStatusToString(status),
    };
  }
}

class EmployeeAttendance {
  EmployeeAttendance({
    this.docId,
    required this.employeeId,
    required this.attendance,
  });

  final String? docId;
  final int employeeId;
  final List<AttendanceRecord> attendance;

  factory EmployeeAttendance.fromFirestore(
    DocumentSnapshot<Map<String, dynamic>> doc,
  ) {
    final data = doc.data() ?? <String, dynamic>{};
    final records = (data['attendance'] as List<dynamic>? ?? [])
        .map(
          (e) => AttendanceRecord.fromMap(Map<String, dynamic>.from(e as Map)),
        )
        .toList();
    return EmployeeAttendance(
      docId: doc.id,
      employeeId: data['employeeId'] is int
          ? data['employeeId'] as int
          : int.tryParse('${data['employeeId']}') ?? 0,
      attendance: records,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'employeeId': employeeId,
      'attendance': attendance.map((record) => record.toMap()).toList(),
    };
  }
}
