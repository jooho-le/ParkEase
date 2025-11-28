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

  // 로그아웃 확인 다이얼로그
  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('로그아웃'),
        content: const Text('정말 로그아웃 하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('취소'),
          ),
          TextButton(
            onPressed: () async {
              await _authService.logout();
              if (context.mounted) {
                // 1. 다이얼로그 닫기
                Navigator.of(dialogContext).pop();
                
                // 2. 최상위 Navigator를 찾아서 로그인 화면으로 이동
                Navigator.of(context, rootNavigator: true).pushNamedAndRemoveUntil(
                  '/login',
                  (route) => false,
                );
              }
            },
            child: Text(
              '로그아웃',
              style: TextStyle(color: kFullColor),
            ),
          ),
        ],
      ),
    );
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
                        Text("${user.id} | ${user.carNumber ?? '차량 미등록'}", style: kSubBodyStyle),
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
                  _buildMenuTile(
                    Icons.history,
                    "주차 이력 조회",
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('주차 이력 조회 기능 준비 중입니다.')),
                      );
                    },
                  ),
                  _buildMenuTile(
                    Icons.directions_car,
                    "차량 등록/관리",
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('차량 등록/관리 기능 준비 중입니다.')),
                      );
                    },
                  ),
                  _buildMenuTile(
                    Icons.notifications_outlined,
                    "알림 설정",
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('알림 설정 기능 준비 중입니다.')),
                      );
                    },
                  ),
                  const Divider(),
                  _buildMenuTile(
                    Icons.help_outline,
                    "도움말 및 지원",
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('도움말 및 지원 기능 준비 중입니다.')),
                      );
                    },
                  ),
                  _buildMenuTile(
                    Icons.logout,
                    "로그아웃",
                    isDestructive: true,
                    onTap: () => _showLogoutDialog(context), // ✅ 로그아웃 다이얼로그 호출
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuTile(
    IconData icon,
    String title, {
    bool isDestructive = false,
    VoidCallback? onTap, // ✅ onTap 파라미터 추가
  }) {
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
          ),
        ),
        trailing: Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        onTap: onTap, // ✅ onTap 연결
      ),
    );
  }
}