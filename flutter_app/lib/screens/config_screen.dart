import 'package:flutter/material.dart';
import 'package:flutter_app/models/config_models.dart';
import 'package:flutter_app/state/config_notifier.dart';
import 'package:flutter_app/widgets/async_value_widget.dart';
import 'package:flutter_app/widgets/glass_panel.dart';
import 'package:flutter_app/widgets/next_gradient_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ConfigScreen extends ConsumerWidget {
  const ConfigScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final config = ref.watch(configProvider);

    return NextGradientPage(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1000),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _ConfigHero(),
                const SizedBox(height: 24),
                AsyncValueWidget(
                  value: config,
                  dataBuilder: (data) => Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _ConfigSection(
                        title: 'Departments',
                        child: _StringListEditor(
                          values: data.departments,
                          onChanged: (updated) => ref
                              .read(configProvider.notifier)
                              .updateDepartments(updated),
                        ),
                      ),
                      const SizedBox(height: 24),
                      _ConfigSection(
                        title: 'Roles',
                        child: _StringListEditor(
                          values: data.roles,
                          onChanged: (updated) => ref
                              .read(configProvider.notifier)
                              .updateRoles(updated),
                        ),
                      ),
                      const SizedBox(height: 24),
                      _ConfigSection(
                        title: 'Sites',
                        child: _EntityListEditor<Site>(
                          values: data.sites,
                          labelBuilder: (site) => site.name,
                          onCreate: (name) {
                            final sites = List<Site>.from(data.sites)
                              ..add(Site(id: name.toLowerCase(), name: name));
                            ref.read(configProvider.notifier).updateSites(sites);
                          },
                          onDelete: (site) {
                            final sites = List<Site>.from(data.sites)
                              ..removeWhere((item) => item.id == site.id);
                            ref.read(configProvider.notifier).updateSites(sites);
                          },
                        ),
                      ),
                      const SizedBox(height: 24),
                      _ConfigSection(
                        title: 'Suppliers',
                        child: _EntityListEditor<Supplier>(
                          values: data.suppliers,
                          labelBuilder: (supplier) => supplier.name,
                          onCreate: (name) {
                            final suppliers = List<Supplier>.from(data.suppliers)
                              ..add(Supplier(id: name.toLowerCase(), name: name));
                            ref
                                .read(configProvider.notifier)
                                .updateSuppliers(suppliers);
                          },
                          onDelete: (supplier) {
                            final suppliers = List<Supplier>.from(data.suppliers)
                              ..removeWhere((item) => item.id == supplier.id);
                            ref
                                .read(configProvider.notifier)
                                .updateSuppliers(suppliers);
                          },
                        ),
                      ),
                    ],
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

class _ConfigHero extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GlassPanel(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'System Configuration',
            style: theme.textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.w700,
              height: 1.1,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Recreated frosted hero mirroring the Next.js configure route, featuring '
            'departments, roles, sites, and suppliers management.',
            style: theme.textTheme.titleMedium?.copyWith(color: Colors.white70),
          ),
        ],
      ),
    );
  }
}

class _ConfigSection extends StatelessWidget {
  const _ConfigSection({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600,
              ),
        ),
        const SizedBox(height: 12),
        child,
      ],
    );
  }
}

class _StringListEditor extends StatefulWidget {
  const _StringListEditor({required this.values, required this.onChanged});

  final List<String> values;
  final ValueChanged<List<String>> onChanged;

  @override
  State<_StringListEditor> createState() => _StringListEditorState();
}

class _StringListEditorState extends State<_StringListEditor> {
  late List<String> _items;
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _items = List<String>.from(widget.values);
  }

  @override
  void didUpdateWidget(covariant _StringListEditor oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.values != widget.values) {
      _items = List<String>.from(widget.values);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GlassPanel(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(
                    labelText: 'Add new entry',
                  ),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: () {
                  if (_controller.text.trim().isEmpty) return;
                  setState(() => _items.add(_controller.text.trim()));
                  widget.onChanged(_items);
                  _controller.clear();
                },
                child: const Text('Add'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _items
                .map(
                  (item) => Chip(
                    label: Text(item),
                    onDeleted: () {
                      setState(() => _items.remove(item));
                      widget.onChanged(_items);
                    },
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}

class _EntityListEditor<T> extends StatelessWidget {
  const _EntityListEditor({
    required this.values,
    required this.labelBuilder,
    required this.onCreate,
    required this.onDelete,
  });

  final List<T> values;
  final String Function(T) labelBuilder;
  final ValueChanged<String> onCreate;
  final ValueChanged<T> onDelete;

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController();
    return GlassPanel(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  decoration: const InputDecoration(labelText: 'Name'),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: () {
                  if (controller.text.trim().isEmpty) return;
                  onCreate(controller.text.trim());
                  controller.clear();
                },
                child: const Text('Add'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...values.map(
            (value) => ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(labelBuilder(value)),
              trailing: IconButton(
                icon: const Icon(Icons.delete_outline),
                onPressed: () => onDelete(value),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

