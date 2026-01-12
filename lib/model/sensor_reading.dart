/*
 * ==========================================
 * [데이터 모델: 센서 읽기]
 * 서버에서 수신한 센서 측정 값을 앱에서 사용하기 쉽게 변환합니다.
 * ==========================================
 */
class SensorReading {
  final String id;
  final String sensorId;
  final double distanceCm;
  final double thresholdCm;
  final bool ledState;
  final DateTime createdAt;
  final Map<String, dynamic> metadata;

  SensorReading({
    required this.id,
    required this.sensorId,
    required this.distanceCm,
    required this.thresholdCm,
    required this.ledState,
    required this.createdAt,
    required this.metadata,
  });

  factory SensorReading.fromJson(Map<String, dynamic> json) {
    final metadata = json['metadata'];
    return SensorReading(
      id: json['id'] ?? 'unknown',
      sensorId: json['sensorId'] ?? 'unknown',
      distanceCm: (json['distanceCm'] ?? 0).toDouble(),
      thresholdCm: (json['thresholdCm'] ?? 0).toDouble(),
      ledState: json['ledState'] == true,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      metadata: metadata is Map<String, dynamic> ? metadata : <String, dynamic>{},
    );
  }
}
