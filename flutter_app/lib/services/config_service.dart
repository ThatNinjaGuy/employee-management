import 'dart:math';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_app/models/config_models.dart';

class ConfigService {
  ConfigService(this._firestore);

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _collection =>
      _firestore.collection('config');

  Future<List<String>> _fetchStringList(String type) async {
    final snapshot = await _collection.where('type', isEqualTo: type).get();
    if (snapshot.docs.isEmpty) return [];
    final data = snapshot.docs.first.data();
    final values = data['data'] as List<dynamic>? ?? [];
    return values.map((e) => e.toString()).toList();
  }

  Future<List<Supplier>> _fetchSuppliers() async {
    final snapshot = await _collection
        .where('type', isEqualTo: 'suppliers')
        .get();
    if (snapshot.docs.isEmpty) return [];
    final data = snapshot.docs.first.data();
    final values = data['data'] as List<dynamic>? ?? [];
    return values
        .map((e) => Supplier.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<List<Site>> _fetchSites() async {
    final snapshot = await _collection.where('type', isEqualTo: 'sites').get();
    if (snapshot.docs.isEmpty) return [];
    final data = snapshot.docs.first.data();
    final values = data['data'] as List<dynamic>? ?? [];
    return values
        .map((e) => Site.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<ConfigData> fetchConfig() async {
    final results = await Future.wait([
      _fetchStringList('departments'),
      _fetchStringList('roles'),
      _fetchSuppliers(),
      _fetchSites(),
    ]);

    return ConfigData(
      departments: results[0] as List<String>,
      roles: results[1] as List<String>,
      suppliers: results[2] as List<Supplier>,
      sites: results[3] as List<Site>,
    );
  }

  Future<void> updateDepartments(List<String> departments) async {
    await _upsertList('departments', departments);
  }

  Future<void> updateRoles(List<String> roles) async {
    await _upsertList('roles', roles);
  }

  Future<void> updateSuppliers(List<Supplier> suppliers) async {
    await _upsertList('suppliers', suppliers.map((e) => e.toMap()).toList());
  }

  Future<void> updateSites(List<Site> sites) async {
    await _upsertList('sites', sites.map((e) => e.toMap()).toList());
  }

  Future<void> _upsertList(String type, List<dynamic> data) async {
    final snapshot = await _collection.where('type', isEqualTo: type).get();
    if (snapshot.docs.isEmpty) {
      await _collection.add({
        'type': type,
        'data': data,
        'updatedAt': DateTime.now().toIso8601String(),
      });
      return;
    }
    await _collection.doc(snapshot.docs.first.id).update({
      'data': data,
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  String generateId() => Random().nextInt(1000000).toString();
}
