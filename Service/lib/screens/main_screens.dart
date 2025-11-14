import 'package:flutter/material.dart';
import 'package:parking_app/screens/home/home_screen.dart';
import 'package:parking_app/screens/list/list_screen.dart';
import 'package:parking_app/screens/favorites/favorites_screen.dart';
import 'package:parking_app/screens/my_page/my_page_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  // 현재 선택된 탭의 인덱스(번호)를 관리하는 변수
  // 0: 홈, 1: 목록, 2: 즐겨찾기, 3: 마이페이지
  int _selectedIndex = 0;

  // 각 탭에 해당하는 화면 위젯들을 리스트로 관리
  // 이 리스트 덕분에 탭 추가/삭제가 매우 쉬워집니다.
  static const List<Widget> _widgetOptions = <Widget>[
    HomeScreen(), // 0번 (홈)
    ListScreen(), // 1번 (목록)
    FavoritesScreen(), // 2번 (즐겨찾기)
    MyPageScreen(), // 3번 (마이페이지)
  ];

  // 하단 탭이 클릭되었을 때 호출될 함수
  void _onItemTapped(int index) {
    setState(() {
      // _selectedIndex 값을 클릭된 탭의 인덱스로 변경하여 화면을 다시 그리게 함
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Scaffold는 앱 화면의 기본 구조(AppBar, Body, Nav)를 제공합니다.
    return Scaffold(
      // 1. 상단 앱 바 (AppBar)
      appBar: AppBar(
        title: const Text('AI 스마트 주차'), // 제안하신 와이어프레임의 제목
        actions: [
          // 제안하신 '알림 아이콘'
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {
              // TODO: 알림 화면으로 이동하는 로직 구현
            },
          ),
        ],
      ),

      // 2. 본문 (Body)
      // 현재 선택된 탭(_selectedIndex)에 맞는 화면(_widgetOptions)을 보여줌
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),

      // 3. 하단 네비게이션 바 (BottomNavigationBar)
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: '홈 (지도)',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            label: '목록',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.star_border),
            label: '즐겨찾기',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: '마이페이지',
          ),
        ],
        currentIndex: _selectedIndex, // 현재 선택된 탭을 시각적으로 표시
        selectedItemColor: Colors.blueAccent, // 선택된 아이템 색상
        unselectedItemColor: Colors.grey, // 선택되지 않은 아이템 색상
        showUnselectedLabels: true, // 선택되지 않은 탭의 라벨도 항상 표시
        onTap: _onItemTapped, // 아이템 클릭 시 _onItemTapped 함수 호출
        type: BottomNavigationBarType.fixed, // 탭이 많아져도 고정된 크기 유지
      ),
    );
  }
}