import 'package:flutter/material.dart';
import 'package:webui/services/parking_api.dart';
import 'package:webui/utils/constants.dart';
import 'package:webui/widgets/stats_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final ParkingApiService _apiService = ParkingApiService();
  
  // 비동기 데이터
  late Future<Map<String, dynamic>> _statsFuture;

  @override
  void initState() {
    super.initState();
    _statsFuture = _apiService.getStats();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackgroundColor,
      appBar: AppBar(
        backgroundColor: kCardColor,
        elevation: 0,
        title: Row(
          children: [
            Icon(Icons.local_parking, color: kPrimaryColor),
            const SizedBox(width: 8),
            Text("JBNU Smart Parking", style: TextStyle(color: kPrimaryColor, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. 웰컴 배너 (JBNU 이미지 사용)
            Container(
              width: double.infinity,
              height: 150,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                image: DecorationImage(
                  // JBNU 대표 이미지 URL (안전하게 로컬 에셋이나 플레이스홀더 사용 권장)
                  image: NetworkImage('https://www.jbnu.ac.kr/images/main/main_visual_01.jpg'), 
                  fit: BoxFit.cover,
                  colorFilter: ColorFilter.mode(Colors.black.withValues(alpha:0.3), BlendMode.darken),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("환영합니다!", style: TextStyle(color: Colors.black, fontSize: 22, fontWeight: FontWeight.bold)),
                    Text("교내 주차 공간을 AI로 스마트하게 관리하세요.", style: TextStyle(color: Colors.black26, fontSize: 14)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 2. 통계 섹션 제목
            Text("나의 친환경 기여도", style: kCardTitleStyle),
            const SizedBox(height: 12),

            // 3. 통계 카드 로드
            FutureBuilder<Map<String, dynamic>>(
              future: _statsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator(color: kPrimaryColor));
                }
                if (snapshot.hasError) return const Text("데이터 로드 실패");

                final data = snapshot.data!;
                return Row(
                  children: [
                    StatsCard(
                      title: "CO2 절감량",
                      value: "${data['co2_saved']}kg",
                      icon: Icons.eco,
                      accentColor: kAccentColor,
                    ),
                    const SizedBox(width: 12),
                    StatsCard(
                      title: "시간 절약",
                      value: "${data['time_saved']}분",
                      icon: Icons.timer,
                      accentColor: Colors.blue,
                    ),
                  ],
                );
              },
            ),
            
            const SizedBox(height: 24),
            // 4. 피크 타임 안내
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: kPrimaryColor.withValues(alpha:0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: kPrimaryColor.withValues(alpha:0.3)),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: kPrimaryColor),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      "오늘의 예상 피크 타임은 14:00 ~ 16:00 입니다.\n이 시간대를 피하면 쾌적한 주차가 가능합니다.",
                      style: kBodyStyle.copyWith(fontSize: 14),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}