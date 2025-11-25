/*
 * ==========================================
 * [데이터 모델: 사용자]
 * 로그인한 사용자의 정보를 담습니다.
 * 기획서에 명시된 '이용자 유형(학생/교직원)' 필드를 포함합니다.
 * ==========================================
 */
class User {
  final String id;        // 학번 또는 사번
  final String name;      // 사용자 이름
  final String userType;  // 유형 (student, staff, visitor)
  final String carNumber; // 등록된 차량 번호

  User({
    required this.id,
    required this.name,
    required this.userType,
    required this.carNumber,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Guest',
      userType: json['user_type'] ?? 'student',
      carNumber: json['car_number'] ?? '',
    );
  }
}