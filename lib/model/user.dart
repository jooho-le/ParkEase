/*
 * ==========================================
 * [모델: 사용자]
 * 사용자 정보를 담는 데이터 모델
 * ==========================================
 */
class User {
  final String id;
  final String name;
  final String userType; // 'student' 또는 'staff'
  final String? carNumber;

  User({
    required this.id,
    required this.name,
    required this.userType,
    this.carNumber,
  });

  // JSON에서 User 객체 생성
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      userType: json['userType'] as String,
      carNumber: json['carNumber'] as String?,
    );
  }

  // User 객체를 JSON으로 변환
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'userType': userType,
      'carNumber': carNumber,
    };
  }

  // User 객체 복사 (일부 필드만 변경)
  User copyWith({
    String? id,
    String? name,
    String? userType,
    String? carNumber,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      userType: userType ?? this.userType,
      carNumber: carNumber ?? this.carNumber,
    );
  }

  @override
  String toString() {
    return 'User(id: $id, name: $name, userType: $userType, carNumber: $carNumber)';
  }
}