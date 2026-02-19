class Supplier {
  Supplier({required this.id, required this.name});

  final String id;
  final String name;

  factory Supplier.fromMap(Map<String, dynamic> data) {
    return Supplier(
      id: data['id'] as String? ?? '',
      name: data['name'] as String? ?? '',
    );
  }

  Map<String, dynamic> toMap() => {'id': id, 'name': name};
}

class Site {
  Site({required this.id, required this.name});

  final String id;
  final String name;

  factory Site.fromMap(Map<String, dynamic> data) {
    return Site(
      id: data['id'] as String? ?? '',
      name: data['name'] as String? ?? '',
    );
  }

  Map<String, dynamic> toMap() => {'id': id, 'name': name};
}

class ConfigData {
  ConfigData({
    required this.departments,
    required this.roles,
    required this.suppliers,
    required this.sites,
  });

  final List<String> departments;
  final List<String> roles;
  final List<Supplier> suppliers;
  final List<Site> sites;

  ConfigData copyWith({
    List<String>? departments,
    List<String>? roles,
    List<Supplier>? suppliers,
    List<Site>? sites,
  }) {
    return ConfigData(
      departments: departments ?? this.departments,
      roles: roles ?? this.roles,
      suppliers: suppliers ?? this.suppliers,
      sites: sites ?? this.sites,
    );
  }

  static ConfigData empty() => ConfigData(
    departments: const [],
    roles: const [],
    suppliers: const [],
    sites: const [],
  );
}
