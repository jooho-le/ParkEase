import 'package:flutter/material.dart';
import 'package:webui/model/sensor_reading.dart';
import 'package:webui/services/sensor_api.dart';
import 'package:webui/utils/constants.dart';
import 'package:webui/widgets/sensor_reading_card.dart';

class ParkingStatusPage extends StatefulWidget {
  const ParkingStatusPage({super.key});

  @override
  State<ParkingStatusPage> createState() => _ParkingStatusPageState();
}

class _ParkingStatusPageState extends State<ParkingStatusPage> {
  final SensorApiService _sensorService = SensorApiService();
  late Future<List<SensorReading>> _readingsFuture;

  @override
  void initState() {
    super.initState();
    _refreshData();
  }

  void _refreshData() {
    setState(() {
      _readingsFuture = _sensorService.getReadings();
    });
  }

  Future<void> _reloadData() async {
    _refreshData();
    await _readingsFuture;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackgroundColor,
      appBar: AppBar(
        backgroundColor: kCardColor,
        title: Text("실시간 센서 현황", style: TextStyle(color: kTextColor, fontWeight: FontWeight.bold)),
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
      body: FutureBuilder<List<SensorReading>>(
        future: _readingsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: kPrimaryColor));
          }
          if (snapshot.hasError) {
            return Center(child: Text("데이터를 불러오는데 실패했습니다."));
          }
          
          final readings = snapshot.data ?? [];
          
          if (readings.isEmpty) {
            return Center(child: Text("아직 센서 데이터가 없습니다."));
          }

          return RefreshIndicator(
            onRefresh: _reloadData,
            child: ListView.builder(
              physics: const AlwaysScrollableScrollPhysics(),
              itemCount: readings.length,
              itemBuilder: (context, index) {
                return SensorReadingCard(reading: readings[index]);
              },
            ),
          );
        },
      ),
    );
  }
}
