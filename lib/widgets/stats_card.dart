import 'package:flutter/material.dart';
import 'package:webui/utils/constants.dart';

/*
 * ==========================================
 * [위젯: 통계 카드]
 * 홈 대시보드에서 CO2 절감량, 시간 절약 등을 보여주는 카드입니다.
 * ==========================================
 */
class StatsCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color accentColor;

  const StatsCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    this.accentColor = kAccentColor,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha:0.05), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CircleAvatar(
              backgroundColor: accentColor.withValues(alpha:0.2),
              child: Icon(icon, color: accentColor),
            ),
            const SizedBox(height: 12),
            Text(title, style: kSubBodyStyle),
            const SizedBox(height: 4),
            Text(value, style: kHeadlineStyle.copyWith(fontSize: 20)),
          ],
        ),
      ),
    );
  }
}