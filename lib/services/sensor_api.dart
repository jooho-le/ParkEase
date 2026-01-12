import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:webui/model/sensor_reading.dart';
import 'package:webui/utils/constants.dart';

/*
 * ==========================================
 * [서비스: 센서 API]
 * 초음파/LED 센서 데이터를 서버에서 가져옵니다.
 * ==========================================
 */
class SensorApiService {
  static const String baseUrl = kApiBaseUrl;

  Future<List<SensorReading>> getReadings() async {
    final response = await http
        .get(Uri.parse('$baseUrl/api/readings'))
        .timeout(const Duration(seconds: 10));

    if (response.statusCode != 200) {
      throw Exception('Failed to load sensor readings');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    final list = data['data'] as List<dynamic>? ?? [];

    return list
        .map((item) => SensorReading.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<SensorReading?> getLatestReading() async {
    final response = await http
        .get(Uri.parse('$baseUrl/api/readings/latest'))
        .timeout(const Duration(seconds: 10));

    if (response.statusCode != 200) {
      throw Exception('Failed to load latest sensor reading');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    final latest = data['data'];
    if (latest == null) {
      return null;
    }

    return SensorReading.fromJson(latest as Map<String, dynamic>);
  }
}
