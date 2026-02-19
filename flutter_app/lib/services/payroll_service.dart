import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_app/models/payroll.dart';

class PayrollService {
  PayrollService(this._firestore);

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _collection =>
      _firestore.collection('payrolls');

  Future<List<EmployeePayroll>> fetchPayrollForMonth(String month) async {
    final snapshot = await _collection.where('month', isEqualTo: month).get();
    return snapshot.docs.map(EmployeePayroll.fromFirestore).toList();
  }

  Future<void> savePayroll(EmployeePayroll payroll) async {
    if (payroll.docId != null) {
      await _collection.doc(payroll.docId).update(payroll.toMap());
    } else {
      await _collection.add(payroll.toMap());
    }
  }

  Future<void> deletePayroll(String docId) async {
    await _collection.doc(docId).delete();
  }
}
