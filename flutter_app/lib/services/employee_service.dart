import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_app/models/employee.dart';

class EmployeeService {
  EmployeeService(this._firestore);

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _collection =>
      _firestore.collection('employees');

  Future<List<Employee>> fetchEmployees() async {
    final snapshot = await _collection.orderBy('name').get();
    return snapshot.docs.map(Employee.fromFirestore).toList();
  }

  Future<void> saveEmployee(Employee employee) async {
    if (employee.docId != null) {
      await _collection.doc(employee.docId).update(employee.toMap());
    } else {
      await _collection.add(employee.toMap());
    }
  }

  Future<void> deleteEmployee(String docId) async {
    await _collection.doc(docId).delete();
  }
}
