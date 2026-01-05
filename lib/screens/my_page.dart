import 'package:flutter/material.dart';
import 'package:webui/model/user.dart';
import 'package:webui/screens/notification_settings_page.dart';
import 'package:webui/screens/reservation_history_page.dart';
import 'package:webui/services/auth_service.dart';
import 'package:webui/services/profile_service.dart';
import 'package:webui/utils/constants.dart';

class MyPage extends StatefulWidget {
  const MyPage({super.key});

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> {
  final AuthService _authService = AuthService();
  final ProfileService _profileService = ProfileService();
  User? _user;
  bool _isLoadingProfile = false;

  @override
  void initState() {
    super.initState();
    _user = _authService.currentUser;
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoadingProfile = true);
    try {
      final user = await _profileService.getProfile();
      if (!mounted) {
        return;
      }
      setState(() => _user = user);
    } catch (_) {
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('프로필 정보를 불러오지 못했습니다.')),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoadingProfile = false);
      }
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
    final user = _user ?? _authService.currentUser;

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
                        Text(
                          "${user.id} | ${user.carNumber == null || user.carNumber!.isEmpty ? '차량 미등록' : user.carNumber}",
                          style: kSubBodyStyle,
                        ),
                      ],
                    )
                  else
                    Text(
                      _isLoadingProfile ? "불러오는 중..." : "로그인이 필요합니다.",
                      style: kBodyStyle,
                    ),
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
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => const ReservationHistoryPage(),
                        ),
                      );
                    },
                  ),
                  _buildMenuTile(
                    Icons.directions_car,
                    "차량 등록/관리",
                    onTap: () {
                      _showCarNumberDialog(context, user?.carNumber);
                    },
                  ),
                  _buildMenuTile(
                    Icons.notifications_outlined,
                    "알림 설정",
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => const NotificationSettingsPage(),
                        ),
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

  void _showCarNumberDialog(BuildContext context, String? currentCarNumber) {
    final controller = TextEditingController(text: currentCarNumber ?? '');
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text('차량 번호 등록'),
              content: TextField(
                controller: controller,
                decoration: const InputDecoration(
                  hintText: '차량 번호를 입력하세요',
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSaving ? null : () => Navigator.pop(dialogContext),
                  child: const Text('취소'),
                ),
                TextButton(
                  onPressed: isSaving
                      ? null
                      : () async {
                          setDialogState(() => isSaving = true);
                          try {
                            final value = controller.text.trim();
                            final updatedUser = await _profileService.updateCarNumber(
                              value.isEmpty ? null : value,
                            );
                            if (!mounted) {
                              return;
                            }
                            setState(() => _user = updatedUser);
                            Navigator.pop(dialogContext);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('차량 정보가 저장되었습니다.')),
                            );
                          } catch (_) {
                            if (!mounted) {
                              return;
                            }
                            setDialogState(() => isSaving = false);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('차량 정보를 저장하지 못했습니다.')),
                            );
                          }
                        },
                  child: isSaving
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('저장'),
                ),
              ],
            );
          },
        );
      },
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
