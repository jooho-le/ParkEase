/*
 * ==========================================
 * [데이터 모델: 예약]
 * 주차장 예약 정보를 관리합니다.
 * ==========================================
 */
class Reservation {
  final String id;
  final String lotName;
  final String status;
  final DateTime createdAt;
  final DateTime expiresAt;
  final DateTime updatedAt;

  Reservation({
    required this.id,
    required this.lotName,
    required this.status,
    required this.createdAt,
    required this.expiresAt,
    required this.updatedAt,
  });

  factory Reservation.fromJson(Map<String, dynamic> json) {
    return Reservation(
      id: json['id'] as String,
      lotName: json['lotName'] as String,
      status: json['status'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      expiresAt: DateTime.parse(json['expiresAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'lotName': lotName,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'expiresAt': expiresAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
