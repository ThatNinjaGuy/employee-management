import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:responsive_framework/responsive_framework.dart';

import 'app_router.dart';
import 'firebase/firebase_initializer.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FirebaseInitializer.initialize();
  runApp(const ProviderScope(child: EmployeeManagementApp()));
}

class EmployeeManagementApp extends StatelessWidget {
  const EmployeeManagementApp({super.key});

  static final _router = createRouter();

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Employee Management',
      theme: AppTheme.nextTheme(),
      routerConfig: _router,
      builder: (context, child) {
        return ResponsiveBreakpoints.builder(
          child: child ?? const SizedBox.shrink(),
          breakpoints: AppTheme.breakpoints,
        );
      },
    );
  }
}
