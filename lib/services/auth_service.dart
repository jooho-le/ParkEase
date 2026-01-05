import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:webui/model/user.dart';
import 'package:webui/utils/constants.dart';

/*
 * ==========================================
 * [서비스: 인증 로직]
 * 로그인, 로그아웃, 회원가입, JWT 토큰 관리
 * ==========================================
 */
class AuthService {
  // 싱글톤 패턴
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  // API 기본 URL (실제 서버 주소로 변경 필요)
  static const String baseUrl = kApiBaseUrl;
  
  // 보안 저장소
  final _storage = const FlutterSecureStorage();
  
  // 현재 로그인된 사용자
  User? _currentUser;
  
  // 토큰 키
  static const String _tokenKey = 'jwt_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userKey = 'user_data';

  User? get currentUser => _currentUser;

  Future<void> saveUser(User user) async {
    _currentUser = user;
    await _storage.write(key: _userKey, value: jsonEncode(user.toJson()));
  }
  
  // ==========================================
  // 로그인
  // ==========================================
  Future<bool> login(String id, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'id': id,
          'password': password,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['token'] != null && data['user'] != null) {
          await _storage.write(key: _tokenKey, value: data['token']);
          _currentUser = User.fromJson(data['user']);
          await _storage.write(key: _userKey, value: jsonEncode(data['user']));
          return true;
        }
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  // ==========================================
  // 회원가입
  // ==========================================
  Future<bool> register({
    required String id,
    required String password,
    required String name,
    required String userType,
    String? carNumber,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'id': id,
          'password': password,
          'name': name,
          'userType': userType,
          'carNumber': carNumber,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // 회원가입 후 자동 로그인
        if (data['token'] != null) {
          await _storage.write(key: _tokenKey, value: data['token']);
          _currentUser = User.fromJson(data['user']);
          await _storage.write(key: _userKey, value: jsonEncode(data['user']));
        }
        
        return true;
      } else {
        return false;
      }
    } catch (e) {
      print('Register error: $e');
      return false;
    }
  }

  // ==========================================
  // OAuth 로그인 (Google)
  // ==========================================
  Future<bool> googleLogin(String idToken) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/google'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'idToken': idToken,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await _storage.write(key: _tokenKey, value: data['token']);
        _currentUser = User.fromJson(data['user']);
        await _storage.write(key: _userKey, value: jsonEncode(data['user']));
        return true;
      }
      return false;
    } catch (e) {
      print('Google login error: $e');
      return false;
    }
  }

  // ==========================================
  // OAuth 로그인 (Kakao)
  // ==========================================
  Future<bool> kakaoLogin(String accessToken) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/kakao'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'accessToken': accessToken,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await _storage.write(key: _tokenKey, value: data['token']);
        _currentUser = User.fromJson(data['user']);
        await _storage.write(key: _userKey, value: jsonEncode(data['user']));
        return true;
      }
      return false;
    } catch (e) {
      print('Kakao login error: $e');
      return false;
    }
  }

  // ==========================================
  // 자동 로그인 (토큰 확인)
  // ==========================================
  Future<bool> autoLogin() async {
    try {
      final token = await _storage.read(key: _tokenKey);
      if (token == null) return false;

      // 저장된 사용자 정보 불러오기
      final userJson = await _storage.read(key: _userKey);
      if (userJson != null) {
        _currentUser = User.fromJson(jsonDecode(userJson));
        
        // 토큰 유효성 검증 (선택사항)
        final isValid = await _verifyToken(token);
        if (!isValid) {
          await logout();
          return false;
        }
        
        return true;
      }
      return false;
    } catch (e) {
      print('Auto login error: $e');
      return false;
    }
  }

  // ==========================================
  // 토큰 유효성 검증
  // ==========================================
  Future<bool> _verifyToken(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/verify'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 5));

      return response.statusCode == 200;
    } catch (e) {
      print('Token verification error: $e');
      return false;
    }
  }

  // ==========================================
  // 로그아웃
  // ==========================================
  Future<void> logout() async {
    _currentUser = null;
    await _storage.deleteAll();
  }

  // ==========================================
  // JWT 토큰 가져오기
  // ==========================================
  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  // ==========================================
  // 인증 헤더 생성
  // ==========================================
  Future<Map<String, String>> getAuthHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // ==========================================
  // API 요청 (인증 포함)
  // ==========================================
  Future<http.Response> authenticatedRequest(
    String method,
    String endpoint, {
    Map<String, dynamic>? body,
  }) async {
    final headers = await getAuthHeaders();
    final uri = Uri.parse('$baseUrl$endpoint');

    switch (method.toUpperCase()) {
      case 'GET':
        return await http.get(uri, headers: headers);
      case 'POST':
        return await http.post(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
      case 'PUT':
        return await http.put(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
      case 'DELETE':
        return await http.delete(uri, headers: headers);
      default:
        throw Exception('Unsupported HTTP method: $method');
    }
  }

}
