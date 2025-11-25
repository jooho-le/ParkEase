import 'dart:async';
import 'package:webui/model/user.dart';

/*
 * ==========================================
 * [서비스: 인증 로직]
 * 로그인, 로그아웃, 사용자 세션 관리를 담당합니다.
 * 현재는 데모를 위해 가상의 데이터를 반환합니다.
 * ==========================================
 */
class AuthService {
  // 싱글톤 패턴 (앱 전역에서 하나의 인스턴스만 사용)
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  User? _currentUser;

  // 로그인 (Mock)
  Future<bool> login(String id, String password) async {
    // 실제 API 호출 대신 1초 딜레이
    await Future.delayed(const Duration(seconds: 1));
    
    _currentUser = User(
      id: id,
      name: '문민규', // 기획서 작성자 이름 예시
      userType: 'student',
      carNumber: '123가 4567',
    );
    return true;
  }

  // 로그아웃
  Future<void> logout() async {
    _currentUser = null;
  }

  User? get currentUser => _currentUser;
}