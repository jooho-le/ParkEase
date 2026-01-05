import 'dart:convert';

import 'package:webui/model/user.dart';
import 'package:webui/services/auth_service.dart';

class ProfileService {
  final AuthService _authService = AuthService();

  Future<User> getProfile() async {
    final response = await _authService.authenticatedRequest('GET', '/api/profile');
    if (response.statusCode != 200) {
      throw Exception(_parseError(response.body));
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    return User.fromJson(payload['user'] as Map<String, dynamic>);
  }

  Future<User> updateCarNumber(String? carNumber) async {
    final response = await _authService.authenticatedRequest(
      'PUT',
      '/api/profile',
      body: {'carNumber': carNumber},
    );
    if (response.statusCode != 200) {
      throw Exception(_parseError(response.body));
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    final user = User.fromJson(payload['user'] as Map<String, dynamic>);
    await _authService.saveUser(user);
    return user;
  }

  String _parseError(String body) {
    try {
      final payload = jsonDecode(body) as Map<String, dynamic>;
      return payload['error']?.toString() ?? '요청에 실패했습니다.';
    } catch (_) {
      return '요청에 실패했습니다.';
    }
  }
}
