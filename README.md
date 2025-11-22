JBNU Smart Parking App (Frontend)

전북대학교 스마트 주차 시스템 모바일 애플리케이션

본 리포지토리는 JBNU Smart Parking 시스템의 사용자 인터페이스(Frontend) 소스 코드를 담고 있습니다.
Flutter 프레임워크를 사용하여 Android 및 iOS 크로스플랫폼을 지원하며, 전북대학교의 상징색(Green)을 테마로 한 직관적인 UI를 제공합니다.

현재 구현 현황 (Current Implementation)

현재 UI 프로토타입 및 Mock Data 연동 단계가 완료되었습니다.
주요 화면과 위젯은 컴포넌트화되어 있으며, 가상의 데이터를 통해 앱의 흐름(User Flow)을 시뮬레이션할 수 있습니다.

1. 홈 대시보드 (HomePage)

웰컴 배너: JBNU 이미지를 활용한 사용자 환영 메시지

통계 카드: 개인의 환경 기여도(CO2 절감량, 시간 절약) 시각화

피크타임 안내: AI 분석 기반 예상 혼잡 시간대 안내 UI

2. 실시간 주차 현황 (ParkingStatusPage)

주차장 리스트: 교내 주차장별 실시간 잔여 주차면 수 표시

상태 시각화: 여유(초록), 혼잡(주황), 만차(빨강) 색상 코딩 적용

예약 인터페이스: '예약하기' 버튼 및 다이얼로그 UI (기능 모의 구현)

3. 마이페이지 (MyPage)

사용자 프로필: 이름, 학번, 등록 차량 번호 표시

메뉴 리스트: 주차 이력 조회, 알림 설정 등 설정 메뉴 UI

자동 로그인 시뮬레이션: 앱 실행 시 Mock Auth 서비스를 통한 자동 세션 로드

프론트엔드 폴더 구조

유지보수와 확장성을 고려하여 기능 단위가 아닌 역할 단위로 폴더를 구조화했습니다.

lib/
├── main.dart                   # 앱 엔트리 포인트 & 테마 설정
├── models/                     # 데이터 모델 (JSON Parsing)
│   ├── parking_lot.dart        # 주차장 객체
│   ├── user.dart               # 사용자 객체
│   └── reservation.dart        # 예약 객체
├── screens/                    # 페이지 단위 화면
│   ├── home_page.dart          # [탭 1] 홈 화면
│   ├── parking_status_page.dart # [탭 2] 주차 현황 화면
│   └── my_page.dart            # [탭 3] 마이페이지
├── services/                   # API 통신 및 비즈니스 로직
│   ├── auth_service.dart       # 로그인/인증 (Mock)
│   ├── parking_api.dart        # 데이터 페칭 (Mock)
├── utils/                      # 상수 및 헬퍼 함수
│   ├── constants.dart          # JBNU 컬러 팔레트 및 스타일
│   └── helpers.dart            # 포맷팅 함수
└── widgets/                    # 재사용 가능한 UI 컴포넌트
    ├── navigation_bar.dart     # 커스텀 하단 탭 바
    ├── parking_lot_card.dart   # 주차장 정보 카드
    └── stats_card.dart         # 통계 정보 카드


🚀 프론트엔드 작업 로드맵 (Frontend Roadmap)

현재 구현된 UI를 바탕으로, 실제 서비스 배포를 위해 진행해야 할 남은 작업들입니다.

Phase 1: UI 고도화 및 기능 추가 (In Progress)

[x] 기본 UI 골격 및 테마 적용: JBNU 컬러 시스템 적용 완료

[x] 주요 화면 구현: 홈, 리스트, 마이페이지

[ ] 지도 뷰(Map View) 구현: ParkingStatusPage에 Google Maps 또는 Naver Maps SDK 연동

[ ] 로그인/회원가입 화면: 현재의 자동 로그인 Mock을 대체할 실제 입력 폼 UI 개발

[ ] 예약 상세 화면: 예약 확인 및 QR코드 발급 화면 디자인

Phase 2: 데이터 연동 (API Integration)

[ ] HTTP 클라이언트 연동: services/ 폴더 내의 Mock 데이터를 실제 백엔드 REST API(http 패키지)로 교체

[ ] 상태 관리 도입: 현재의 setState 구조를 Provider 또는 Riverpod으로 고도화하여 전역 상태 관리

[ ] 에러 핸들링: 네트워크 오류, 데이터 로드 실패 시 보여줄 Error Widget 및 Skeleton Loader 구현

Phase 3: 최적화 및 배포 준비

[ ] 푸시 알림 연동: Firebase Cloud Messaging (FCM) 설정 및 알림 수신 로직 구현

[ ] 디바이스 대응: 다양한 해상도 및 다크 모드 대응

[ ] 스플래시 스크린: 앱 구동 시 보여줄 로고 애니메이션 화면 추가

🛠️ 설치 및 실행 (Setup)

리포지토리 클론

git clone [Repository URL]
cd smart_parking_jbnu


의존성 설치

flutter pub get


앱 실행

flutter run


작성자: 문민규 (Frontend Developer)
최종 업데이트: 2025.11.22