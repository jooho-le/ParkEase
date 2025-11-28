import 'package:flutter/material.dart';
import 'package:webui/screens/home_page.dart';
import 'package:webui/screens/my_page.dart';
import 'package:webui/screens/parking_status_page.dart';
import 'package:webui/utils/constants.dart';
import 'package:webui/widgets/navigation_bar.dart';

import 'screens/login_screen.dart';
import 'screens/register_screen.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ParkEase',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),

      
      debugShowCheckedModeBanner: false,
      
      initialRoute: '/login',

      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/home': (context) => const SmartParkingApp(), // ✅ 수정: HomePage → SmartParkingApp
      },
    );
  }
}

class SmartParkingApp extends StatelessWidget {
  const SmartParkingApp({super.key});

  @override
  Widget build(BuildContext context) {
    // ✅ MaterialApp을 Scaffold로 변경
    // 이유: 이미 MyApp에서 MaterialApp을 사용 중이므로 중복 방지
    return Theme(
      data: ThemeData(
        primaryColor: kPrimaryColor,
        scaffoldBackgroundColor: kBackgroundColor,
        useMaterial3: true,
        
        // 색상 스키마 설정
        colorScheme: ColorScheme.fromSeed(
          seedColor: kPrimaryColor,
          primary: kPrimaryColor,
          secondary: kAccentColor,
        ),

        // 1. 폰트 설정
        fontFamily: 'NotoSansKR', 
        
        // 2. 카드 테마 설정
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
        ),
      ),
      child: const MainShell(),
    );
  }
}

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _selectedIndex = 0;

  // 화면 리스트
  final List<Widget> _screens = [
    const HomePage(),
    const ParkingStatusPage(),
    const MyPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // IndexedStack: 탭 전환 시에도 화면 상태 유지
      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),
      // widgets/navigation_bar.dart의 클래스 이름과 일치해야 함 (CustomNavigationBar)
      bottomNavigationBar: CustomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}