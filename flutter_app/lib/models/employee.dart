import 'package:cloud_firestore/cloud_firestore.dart';

class Employee {
  Employee({
    this.docId,
    required this.id,
    required this.name,
    required this.email,
    required this.position,
    required this.department,
    required this.joinDate,
    required this.hourlyRate,
    this.siteId,
    this.supplierId,
  });

  final String? docId;
  final int id;
  final String name;
  final String email;
  final String position;
  final String department;
  final DateTime joinDate;
  final double hourlyRate;
  final String? siteId;
  final String? supplierId;

  factory Employee.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? <String, dynamic>{};
    return Employee(
      docId: doc.id,
      id: data['id'] is int
          ? data['id'] as int
          : int.tryParse('${data['id']}') ?? 0,
      name: data['name'] as String? ?? '',
      email: data['email'] as String? ?? '',
      position: data['position'] as String? ?? '',
      department: data['department'] as String? ?? '',
      joinDate:
          DateTime.tryParse(data['joinDate'] as String? ?? '') ??
          DateTime.now(),
      hourlyRate: (data['hourlyRate'] as num?)?.toDouble() ?? 0,
      siteId: data['siteId'] as String?,
      supplierId: data['supplierId'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'position': position,
      'department': department,
      'joinDate': joinDate.toIso8601String().split('T').first,
      'hourlyRate': hourlyRate,
      if (siteId != null) 'siteId': siteId,
      if (supplierId != null) 'supplierId': supplierId,
    };
  }

  Employee copyWith({
    String? docId,
    int? id,
    String? name,
    String? email,
    String? position,
    String? department,
    DateTime? joinDate,
    double? hourlyRate,
    String? siteId,
    String? supplierId,
  }) {
    return Employee(
      docId: docId ?? this.docId,
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      position: position ?? this.position,
      department: department ?? this.department,
      joinDate: joinDate ?? this.joinDate,
      hourlyRate: hourlyRate ?? this.hourlyRate,
      siteId: siteId ?? this.siteId,
      supplierId: supplierId ?? this.supplierId,
    );
  }
}
