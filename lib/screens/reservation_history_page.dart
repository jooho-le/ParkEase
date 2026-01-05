import 'package:flutter/material.dart';
import 'package:webui/model/reservation.dart';
import 'package:webui/services/reservation_api.dart';
import 'package:webui/utils/constants.dart';
import 'package:webui/utils/helper.dart';

class ReservationHistoryPage extends StatefulWidget {
  const ReservationHistoryPage({super.key});

  @override
  State<ReservationHistoryPage> createState() => _ReservationHistoryPageState();
}

class _ReservationHistoryPageState extends State<ReservationHistoryPage> {
  final ReservationApiService _reservationService = ReservationApiService();
  late Future<List<Reservation>> _reservationsFuture;

  @override
  void initState() {
    super.initState();
    _reservationsFuture = _reservationService.getMyReservations();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('주차 이력'),
        backgroundColor: kCardColor,
        foregroundColor: kTextColor,
        elevation: 1,
      ),
      backgroundColor: kBackgroundColor,
      body: FutureBuilder<List<Reservation>>(
        future: _reservationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: kPrimaryColor),
            );
          }
          if (snapshot.hasError) {
            return const Center(child: Text('주차 이력을 불러오지 못했습니다.'));
          }

          final reservations = snapshot.data ?? [];
          if (reservations.isEmpty) {
            return const Center(child: Text('예약 이력이 없습니다.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: reservations.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final reservation = reservations[index];
              final statusText = _statusText(reservation.status);
              final statusColor = _statusColor(reservation.status);
              return Card(
                elevation: 0,
                color: kCardColor,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              reservation.lotName,
                              style: kCardTitleStyle,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: statusColor),
                            ),
                            child: Text(
                              statusText,
                              style: TextStyle(
                                color: statusColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "예약 시각: ${formatTimestamp(reservation.createdAt)}",
                        style: kSubBodyStyle,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "만료 시각: ${formatTimestamp(reservation.expiresAt)}",
                        style: kSubBodyStyle,
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  String _statusText(String status) {
    switch (status) {
      case 'active':
        return '예약중';
      case 'cancelled':
        return '취소';
      case 'expired':
        return '만료';
      default:
        return '알 수 없음';
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'active':
        return kAvailableColor;
      case 'cancelled':
        return kFullColor;
      case 'expired':
        return kWarningColor;
      default:
        return kSubTextColor;
    }
  }
}
