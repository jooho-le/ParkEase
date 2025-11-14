import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Column을 사용해 위젯을 세로로 배치 (검색창 + 지도/패널 영역)
    return Column(
      children: [
        // 1. 검색창
        Container(
          padding: const EdgeInsets.all(16.0),
          child: TextField(
            decoration: InputDecoration(
              hintText: '🔍 주차장 검색',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(30.0),
                borderSide: BorderSide.none,
              ),
              filled: true,
              fillColor: Colors.grey[200],
            ),
          ),
        ),

        // 2. 지도와 슬라이드업 패널 영역 (남은 공간을 모두 차지)
        Expanded(
          // Stack을 사용해 위젯을 겹치게 함 (지도를 배경으로, 패널을 그 위에)
          child: Stack(
            children: [
              // 2-1. 지도 영역 (배경)
              // TODO: 여기에 GoogleMap 또는 NaverMap 위젯을 추가합니다.
              Container(
                color: Colors.grey[300], // 임시 회색 배경
                child: const Center(
                  child: Text(
                    '지도 영역 (Google/Naver Map)',
                    style: TextStyle(color: Colors.black54),
                  ),
                ),
              ),

              // 2-2. 상세정보 슬라이드업 패널 (DraggableScrollableSheet)
              DraggableScrollableSheet(
                initialChildSize: 0.2, // 처음 보일 때의 크기 (화면의 20%)
                minChildSize: 0.15, // 최소 크기 (15%)
                maxChildSize: 0.6, // 최대 크기 (60%)
                builder: (BuildContext context, ScrollController scrollController) {
                  // 패널 자체의 UI
                  return Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(20.0),
                        topRight: Radius.circular(20.0),
                      ),
                      boxShadow: [
                        BoxShadow(
                          blurRadius: 10.0,
                          color: Colors.black26,
                        ),
                      ],
                    ),
                    // 패널 내용을 스크롤 가능하게 함
                    child: ListView(
                      controller: scrollController, // 스크롤 컨트롤러 연결
                      children: [
                        // 패널 상단 손잡이
                        Center(
                          child: Container(
                            width: 40,
                            height: 5,
                            margin: const EdgeInsets.symmetric(vertical: 10.0),
                            decoration: BoxDecoration(
                              color: Colors.grey[300],
                              borderRadius: BorderRadius.circular(10.0),
                            ),
                          ),
                        ),
                        // TODO: 여기에 주차장 상세 정보 또는 목록을 채웁니다.
                        const ListTile(
                          leading: Icon(Icons.local_parking),
                          title: Text('A 주차장'),
                          subtitle: Text('현재 5/50 | 100m'),
                        ),
                        const ListTile(
                          leading: Icon(Icons.local_parking),
                          title: Text('B 주차장 (만석)'),
                          subtitle: Text('0/30 | 300m'),
                        ),
                        // ... (더 많은 주차장 정보)
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}