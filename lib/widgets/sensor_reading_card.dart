import 'package:flutter/material.dart';
import 'package:webui/model/sensor_reading.dart';
import 'package:webui/utils/constants.dart';
import 'package:webui/utils/helper.dart';

class SensorReadingCard extends StatelessWidget {
  final SensorReading reading;

  const SensorReadingCard({
    super.key,
    required this.reading,
  });

  @override
  Widget build(BuildContext context) {
    final ledColor = reading.ledState ? kAvailableColor : kFullColor;
    final ledLabel = reading.ledState ? "ON" : "OFF";

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(reading.sensorId, style: kCardTitleStyle),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: ledColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: ledColor),
                  ),
                  child: Text(
                    "LED $ledLabel",
                    style: TextStyle(color: ledColor, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              "거리: ${reading.distanceCm.toStringAsFixed(1)} cm",
              style: kBodyStyle,
            ),
            const SizedBox(height: 4),
            Text(
              "임계값: ${reading.thresholdCm.toStringAsFixed(1)} cm",
              style: kSubBodyStyle,
            ),
            const SizedBox(height: 12),
            Text(
              formatTimestamp(reading.createdAt),
              style: kSubBodyStyle.copyWith(fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}
