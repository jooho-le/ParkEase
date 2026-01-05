import 'package:flutter/material.dart';
import 'package:webui/model/notification_settings.dart';
import 'package:webui/services/notification_settings_service.dart';
import 'package:webui/utils/constants.dart';

class NotificationSettingsPage extends StatefulWidget {
  const NotificationSettingsPage({super.key});

  @override
  State<NotificationSettingsPage> createState() => _NotificationSettingsPageState();
}

class _NotificationSettingsPageState extends State<NotificationSettingsPage> {
  final NotificationSettingsService _settingsService = NotificationSettingsService();
  late Future<NotificationSettings> _settingsFuture;

  @override
  void initState() {
    super.initState();
    _settingsFuture = _settingsService.getSettings();
  }

  Future<void> _updateSettings(NotificationSettings settings) async {
    setState(() {
      _settingsFuture = _settingsService.updateSettings(settings);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('알림 설정'),
        backgroundColor: kCardColor,
        foregroundColor: kTextColor,
        elevation: 1,
      ),
      backgroundColor: kBackgroundColor,
      body: FutureBuilder<NotificationSettings>(
        future: _settingsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: kPrimaryColor),
            );
          }
          if (snapshot.hasError) {
            return const Center(child: Text('알림 설정을 불러오지 못했습니다.'));
          }

          final settings = snapshot.data ??
              NotificationSettings(pushEnabled: true, marketingEnabled: false);
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                elevation: 0,
                color: kCardColor,
                child: SwitchListTile(
                  value: settings.pushEnabled,
                  onChanged: (value) {
                    _updateSettings(
                      NotificationSettings(
                        pushEnabled: value,
                        marketingEnabled: settings.marketingEnabled,
                      ),
                    );
                  },
                  title: const Text('주차 상태 알림'),
                  subtitle: const Text('예약 만료, 주차장 상태 변동 알림'),
                  activeColor: kPrimaryColor,
                ),
              ),
              const SizedBox(height: 12),
              Card(
                elevation: 0,
                color: kCardColor,
                child: SwitchListTile(
                  value: settings.marketingEnabled,
                  onChanged: (value) {
                    _updateSettings(
                      NotificationSettings(
                        pushEnabled: settings.pushEnabled,
                        marketingEnabled: value,
                      ),
                    );
                  },
                  title: const Text('혜택 및 공지 알림'),
                  subtitle: const Text('이벤트, 공지사항 안내'),
                  activeColor: kPrimaryColor,
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
