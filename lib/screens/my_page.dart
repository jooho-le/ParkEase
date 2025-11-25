import 'package:flutter/material.dart';
import 'package:webui/services/auth_service.dart';
import 'package:webui/utils/constants.dart';

class MyPage extends StatefulWidget {
  const MyPage({super.key});

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> {
  final AuthService _authService = AuthService();

  @override
  void initState() {
    super.initState();
    // 화면 진입 시 자동 로그인 시도 (데모용)
    if (_authService.currentUser == null) {
      _authService.login("20251234", "password").then((_) => setState(() {}));
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = _authService.currentUser;

    return Scaffold(
      backgroundColor: kBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // 1. 프로필 헤더
            Container(
              padding: const EdgeInsets.all(24),
              color: kCardColor,
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: kPrimaryColor,
                    child: Icon(Icons.person, size: 35, color: Colors.white),
                  ),
                  const SizedBox(width: 16),
                  if (user != null)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user.name, style: kHeadlineStyle.copyWith(fontSize: 20)),
                        Text("${user.id} | ${user.carNumber}", style: kSubBodyStyle),
                      ],
                    )
                  else
                    Text("로그인 중...", style: kBodyStyle),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 2. 메뉴 리스트
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  _buildMenuTile(Icons.history, "주차 이력 조회"),
                  _buildMenuTile(Icons.directions_car, "차량 등록/관리"),
                  _buildMenuTile(Icons.notifications_outlined, "알림 설정"),
                  const Divider(),
                  _buildMenuTile(Icons.help_outline, "도움말 및 지원"),
                  _buildMenuTile(Icons.logout, "로그아웃", isDestructive: true),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuTile(IconData icon, String title, {bool isDestructive = false}) {
    return Card(
      elevation: 0,
      color: kCardColor,
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: isDestructive ? kFullColor : kPrimaryColor),
        title: Text(
          title, 
          style: TextStyle(
            color: isDestructive ? kFullColor : kTextColor,
            fontWeight: FontWeight.w500,
          )
        ),
        trailing: Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        onTap: () {
          // 메뉴 클릭 로직
        },
      ),
    );
  }
}