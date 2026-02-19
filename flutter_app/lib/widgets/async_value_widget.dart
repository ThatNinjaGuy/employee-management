import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AsyncValueWidget<T> extends StatelessWidget {
  const AsyncValueWidget({
    super.key,
    required this.value,
    required this.dataBuilder,
  });

  final AsyncValue<T> value;
  final Widget Function(T data) dataBuilder;

  @override
  Widget build(BuildContext context) {
    return value.when(
      data: dataBuilder,
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Something went wrong: $error'),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text('Error details: $error'))),
              child: const Text('Dismiss'),
            ),
          ],
        ),
      ),
    );
  }
}
