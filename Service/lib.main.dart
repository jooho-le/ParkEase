import 'package:flutter/material.dart';
import 'package:parking_app/screens/main_screen.dart'; // MainScreen 파일 경로

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '스마트 주차 모니터링',
      // 앱의 기본 테마 설정 (색상 등)
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      // 앱이 처음 시작될 때 보여줄 화면
      home: const MainScreen(),
      debugShowCheckedModeBanner: false, // 오른쪽 상단 'DEBUG' 배너 숨기기
    );
  }
}