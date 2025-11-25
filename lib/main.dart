import 'package:flutter/material.dart';
import 'package:webui/screens/home_page.dart';
import 'package:webui/screens/my_page.dart';
import 'package:webui/screens/parking_status_page.dart';
import 'package:webui/utils/constants.dart';
import 'package:webui/widgets/navigation_bar.dart';

void main() {
  runApp(const SmartParkingApp());
}

class SmartParkingApp extends StatelessWidget {
  const SmartParkingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'JBNU Smart Parking',
      debugShowCheckedModeBanner: false, // 디버그 띠 제거
      
      // [테마 설정 시작]
      theme: ThemeData(
        primaryColor: kPrimaryColor,
        scaffoldBackgroundColor: kBackgroundColor,
        useMaterial3: true,
        
        // 색상 스키마 설정
        colorScheme: ColorScheme.fromSeed(
          seedColor: kPrimaryColor,
          primary: kPrimaryColor,
          secondary: kAccentColor,
        ),

        // 1. 폰트 설정 (ThemeData의 직접적인 속성입니다)
        fontFamily: 'NotoSansKR', 
        
        // 2. 카드 테마 설정 (ThemeData의 속성입니다)
        cardTheme: CardThemeData(
          elevation: 0,
          // 모서리 둥글게 (const를 쓰면 안 됩니다. BorderRadius.circular는 런타임 계산이 필요합니다)
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
        ),
      ), 
      // [테마 설정 끝]

      home: const MainShell(),
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