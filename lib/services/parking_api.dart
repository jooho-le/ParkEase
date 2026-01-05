import 'dart:async';
import 'package:webui/model/parking_lot.dart';

/*
 * ==========================================
 * [서비스: 주차 API]
 * 백엔드 서버와 통신하여 주차장 현황, 통계 데이터를 가져옵니다.
 * ==========================================
 */
class ParkingApiService {
  
  // 실시간 주차장 목록 가져오기 (현재는 빈 데이터)
  Future<List<ParkingLot>> getParkingLots() async {
    await Future.delayed(const Duration(milliseconds: 1500)); // 로딩 시뮬레이션

    return [];
  }

  // 홈 화면 통계 데이터 가져오기 (현재는 빈 데이터)
  Future<Map<String, dynamic>> getStats() async {
    await Future.delayed(const Duration(milliseconds: 1000));
    return {};
  }
}
