import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_app/models/attendance.dart';

class AttendanceService {
  AttendanceService(this._firestore);

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _collection =>
      _firestore.collection('attendance');

  Future<List<EmployeeAttendance>> fetchAttendanceByDate(DateTime date) async {
    final snapshot = await _collection.get();
    final formatted = date
        .toIso8601String()
        .split('T')
        .first; // YYYY-MM-DD to align with data
    return snapshot.docs
        .map(EmployeeAttendance.fromFirestore)
        .map(
          (record) => EmployeeAttendance(
            docId: record.docId,
            employeeId: record.employeeId,
            attendance: record.attendance
                .where(
                  (entry) =>
                      entry.date.toIso8601String().split('T').first ==
                      formatted,
                )
                .toList(),
          ),
        )
        .where((entry) => entry.attendance.isNotEmpty)
        .toList();
  }

  Future<void> upsertAttendance(EmployeeAttendance record) async {
    if (record.docId != null) {
      await _collection.doc(record.docId).set(record.toMap());
    } else {
      await _collection.add(record.toMap());
    }
  }

  Future<void> addOrUpdateRecord({
    required int employeeId,
    required AttendanceRecord newRecord,
  }) async {
    final query = await _collection
        .where('employeeId', isEqualTo: employeeId)
        .get();
    if (query.docs.isEmpty) {
      await _collection.add(
        EmployeeAttendance(
          employeeId: employeeId,
          attendance: [newRecord],
        ).toMap(),
      );
      return;
    }

    final doc = query.docs.first;
    final attendance = EmployeeAttendance.fromFirestore(doc);
    final updated = attendance.attendance.toList();
    final existingIndex = updated.indexWhere(
      (item) => item.date == newRecord.date,
    );
    if (existingIndex >= 0) {
      updated[existingIndex] = newRecord;
    } else {
      updated.add(newRecord);
    }

    await _collection.doc(doc.id).update({
      'attendance': updated.map((e) => e.toMap()).toList(),
    });
  }
}
