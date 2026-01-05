class NotificationSettings {
  final bool pushEnabled;
  final bool marketingEnabled;

  NotificationSettings({
    required this.pushEnabled,
    required this.marketingEnabled,
  });

  factory NotificationSettings.fromJson(Map<String, dynamic> json) {
    return NotificationSettings(
      pushEnabled: _toBool(json['pushEnabled']),
      marketingEnabled: _toBool(json['marketingEnabled']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'pushEnabled': pushEnabled,
      'marketingEnabled': marketingEnabled,
    };
  }

  static bool _toBool(dynamic value) {
    if (value is bool) {
      return value;
    }
    if (value is num) {
      return value != 0;
    }
    if (value is String) {
      return value == '1' || value.toLowerCase() == 'true';
    }
    return false;
  }
}
