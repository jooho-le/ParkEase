/*
 * ==========================================
 * [데이터 모델: 예약]
 * 주차장 예약 정보를 관리합니다.
 * ==========================================
 */
class Reservation {
  final String reservationId;
  final String parkingLotName;
  final DateTime startTime;
  final DateTime expiryTime; // 예약 만료 시간 (기획서: 일정 시간 내 미도착 시 취소)

  Reservation({
    required this.reservationId,
    required this.parkingLotName,
    required this.startTime,
    required this.expiryTime,
  });
}