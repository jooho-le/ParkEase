import 'dart:convert';

import 'package:webui/model/notification_settings.dart';
import 'package:webui/services/auth_service.dart';

class NotificationSettingsService {
  final AuthService _authService = AuthService();

  Future<NotificationSettings> getSettings() async {
    final response = await _authService.authenticatedRequest(
      'GET',
      '/api/notification-settings',
    );

    if (response.statusCode != 200) {
      throw Exception(_parseError(response.body));
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    return NotificationSettings.fromJson(payload);
  }

  Future<NotificationSettings> updateSettings(NotificationSettings settings) async {
    final response = await _authService.authenticatedRequest(
      'PUT',
      '/api/notification-settings',
      body: settings.toJson(),
    );

    if (response.statusCode != 200) {
      throw Exception(_parseError(response.body));
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    return NotificationSettings.fromJson(payload);
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
