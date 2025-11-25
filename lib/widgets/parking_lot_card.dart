import 'package:flutter/material.dart';
import 'package:webui/model/parking_lot.dart';
import 'package:webui/utils/constants.dart';
import 'package:webui/utils/helper.dart';

/*
 * ==========================================
 * [위젯: 주차장 카드]
 * 주차장 리스트에서 개별 주차장 정보를 보여주는 카드입니다.
 * 진행률 바(Progress Bar)와 예약 버튼을 포함합니다.
 * ==========================================
 */
class ParkingLotCard extends StatelessWidget {
  final ParkingLot lot;
  final VoidCallback onReservePressed;

  const ParkingLotCard({
    super.key,
    required this.lot,
    required this.onReservePressed,
  });

  @override
  Widget build(BuildContext context) {
    // 상태에 따른 색상 결정
    final Color statusColor = getStatusColor(lot.availableSpaces, lot.totalSpaces);
    final double occupancy = 1.0 - (lot.availableSpaces / lot.totalSpaces);

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. 헤더 (이름 및 상태 텍스트)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(lot.name, style: kCardTitleStyle),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha:0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: statusColor),
                  ),
                  child: Text(
                    lot.availableSpaces == 0 ? "만차" : "${lot.availableSpaces}면 여유",
                    style: TextStyle(color: statusColor, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // 2. 정보 (총 주차면 등)
            Text(
              "총 ${lot.totalSpaces}면 중 ${lot.totalSpaces - lot.availableSpaces}면 사용 중",
              style: kSubBodyStyle,
            ),
            const SizedBox(height: 8),

            // 3. 점유율 프로그레스 바
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: occupancy,
                minHeight: 8,
                backgroundColor: Colors.grey[200],
                valueColor: AlwaysStoppedAnimation<Color>(statusColor),
              ),
            ),
            const SizedBox(height: 16),

            // 4. 하단 (업데이트 시간 및 예약 버튼)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(formatTimestamp(lot.lastUpdated), style: kSubBodyStyle.copyWith(fontSize: 12)),
                ElevatedButton(
                  onPressed: lot.availableSpaces > 0 ? onReservePressed : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kPrimaryColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    elevation: 0,
                  ),
                  child: const Text("예약하기"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}