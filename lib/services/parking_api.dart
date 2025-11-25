import 'dart:async';
import 'package:webui/model/parking_lot.dart';

/*
 * ==========================================
 * [서비스: 주차 API]
 * 백엔드 서버와 통신하여 주차장 현황, 통계 데이터를 가져옵니다.
 * ==========================================
 */
class ParkingApiService {
  
  // 실시간 주차장 목록 가져오기 (Mock Data)
  Future<List<ParkingLot>> getParkingLots() async {
    await Future.delayed(const Duration(milliseconds: 1500)); // 로딩 시뮬레이션

    return [
      ParkingLot(
        id: '1',
        name: '공과대학 1호관',
        totalSpaces: 100,
        availableSpaces: 12,
        latitude: 35.846,
        longitude: 127.129,
        lastUpdated: DateTime.now(),
      ),
      ParkingLot(
        id: '2',
        name: '중앙도서관',
        totalSpaces: 150,
        availableSpaces: 0, // 만차
        latitude: 35.847,
        longitude: 127.130,
        lastUpdated: DateTime.now().subtract(const Duration(minutes: 5)),
      ),
      ParkingLot(
        id: '3',
        name: '본부 앞 주차장',
        totalSpaces: 80,
        availableSpaces: 45, // 여유
        latitude: 35.845,
        longitude: 127.128,
        lastUpdated: DateTime.now().subtract(const Duration(minutes: 1)),
      ),
      ParkingLot(
        id: '4',
        name: '진수당 지하',
        totalSpaces: 200,
        availableSpaces: 30,
        latitude: 35.844,
        longitude: 127.131,
        lastUpdated: DateTime.now(),
      ),
    ];
  }

  // 홈 화면 통계 데이터 가져오기 (기획서: CO2 절감, 시간 절약)
  Future<Map<String, dynamic>> getStats() async {
    await Future.delayed(const Duration(milliseconds: 1000));
    return {
      'co2_saved': 12.5,  // kg
      'time_saved': 45,   // 분
      'peak_time': '14:00 ~ 16:00',
    };
  }
}