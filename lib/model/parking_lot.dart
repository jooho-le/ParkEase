/*
 * ==========================================
 * [데이터 모델: 주차장]
 * API에서 받아온 주차장 정보를 앱 내에서 사용하기 쉬운 객체로 변환합니다.
 * ==========================================
 */
class ParkingLot {
  final String id;           // 주차장 고유 ID (예: A-01)
  final String name;         // 주차장 이름 (예: 공과대학 1호관)
  final int totalSpaces;     // 전체 주차면 수
  final int availableSpaces; // 현재 주차 가능 면 수
  final double latitude;     // 위도 (지도 연동용)
  final double longitude;    // 경도 (지도 연동용)
  final DateTime lastUpdated;// 마지막 데이터 갱신 시간

  ParkingLot({
    required this.id,
    required this.name,
    required this.totalSpaces,
    required this.availableSpaces,
    required this.latitude,
    required this.longitude,
    required this.lastUpdated,
  });

  // JSON 데이터를 객체로 변환 (Factory Constructor)
  factory ParkingLot.fromJson(Map<String, dynamic> json) {
    return ParkingLot(
      id: json['spot_id'] ?? 'unknown',
      name: json['name'] ?? '이름 없음',
      totalSpaces: json['total_spaces'] ?? 0,
      availableSpaces: json['available_spaces'] ?? 0,
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      lastUpdated: json['last_updated'] != null 
          ? DateTime.parse(json['last_updated']) 
          : DateTime.now(),
    );
  }
}