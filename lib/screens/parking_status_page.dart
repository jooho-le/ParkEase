import 'package:flutter/material.dart';
import 'package:webui/model/parking_lot.dart';
import 'package:webui/services/parking_api.dart';
import 'package:webui/utils/constants.dart';
import 'package:webui/widgets/parking_lot_card.dart';

class ParkingStatusPage extends StatefulWidget {
  const ParkingStatusPage({super.key});

  @override
  State<ParkingStatusPage> createState() => _ParkingStatusPageState();
}

class _ParkingStatusPageState extends State<ParkingStatusPage> {
  final ParkingApiService _apiService = ParkingApiService();
  late Future<List<ParkingLot>> _lotsFuture;

  @override
  void initState() {
    super.initState();
    _refreshData();
  }

  void _refreshData() {
    setState(() {
      _lotsFuture = _apiService.getParkingLots();
    });
  }

  void _handleReservation(String lotName) {
    // 예약 로직 (기획서 기능)
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("주차 예약 확인"),
        content: Text("$lotName 주차장을 예약하시겠습니까?\n(10분 내 미입차 시 자동 취소)"),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text("취소")),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("예약이 완료되었습니다."), backgroundColor: kPrimaryColor),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: kPrimaryColor),
            child: Text("확인"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackgroundColor,
      appBar: AppBar(
        backgroundColor: kCardColor,
        title: Text("실시간 주차 현황", style: TextStyle(color: kTextColor, fontWeight: FontWeight.bold)),
        elevation: 1,
        iconTheme: IconThemeData(color: kTextColor),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _refreshData,
          ),
          IconButton(
            icon: Icon(Icons.map_outlined),
            onPressed: () {
              // TODO: 지도 뷰 전환 로직 (기획서: Naver/Google Map API)
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("지도 뷰는 준비 중입니다.")));
            },
          ),
        ],
      ),
      body: FutureBuilder<List<ParkingLot>>(
        future: _lotsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: kPrimaryColor));
          }
          if (snapshot.hasError) {
            return Center(child: Text("데이터를 불러오는데 실패했습니다."));
          }
          
          final lots = snapshot.data!;
          
          if (lots.isEmpty) {
            return Center(child: Text("운영 중인 주차장이 없습니다."));
          }

          return ListView.builder(
            itemCount: lots.length,
            itemBuilder: (context, index) {
              return ParkingLotCard(
                lot: lots[index],
                onReservePressed: () => _handleReservation(lots[index].name),
              );
            },
          );
        },
      ),
    );
  }
}
