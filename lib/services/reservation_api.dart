import 'dart:convert';

import 'package:webui/model/reservation.dart';
import 'package:webui/services/auth_service.dart';

class ReservationApiService {
  final AuthService _authService = AuthService();

  Future<List<Reservation>> getMyReservations() async {
    final token = await _authService.getToken();
    if (token == null) {
      throw Exception('로그인이 필요합니다.');
    }

    final response = await _authService.authenticatedRequest(
      'GET',
      '/api/reservations',
    );

    if (response.statusCode != 200) {
      throw Exception(_parseError(response.body));
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    final items = (payload['data'] as List<dynamic>? ?? []);
    return items
        .map((item) => Reservation.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<Reservation> createReservation(String lotName) async {
    final token = await _authService.getToken();
    if (token == null) {
      throw Exception('로그인이 필요합니다.');
    }

    final response = await _authService.authenticatedRequest(
      'POST',
      '/api/reservations',
      body: {'lotName': lotName},
    );

    if (response.statusCode != 201) {
      throw Exception(_parseError(response.body));
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    return Reservation.fromJson(payload);
  }

  Future<Reservation> cancelReservation(String reservationId) async {
    final token = await _authService.getToken();
    if (token == null) {
      throw Exception('로그인이 필요합니다.');
    }

    final response = await _authService.authenticatedRequest(
      'DELETE',
      '/api/reservations/$reservationId',
    );

    if (response.statusCode != 200) {
      throw Exception(_parseError(response.body));
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    return Reservation.fromJson(payload);
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
