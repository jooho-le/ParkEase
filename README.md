# ParkEase

Arduino 센서 + 백엔드(API) 기반으로 다시 정리된 프로젝트입니다.
Flutter 웹/앱 관련 코드는 모두 제거했고, React 프론트엔드는 새로 시작할 예정입니다.

## 구조
```
ParkEase/
├── arduino/            # Arduino 스케치 (센서/게이트/NFC)
├── server/             # Node.js API 서버 (센서 저장, 인증/예약 등)
├── client/             # React 프론트엔드 자리(초기화 상태)
└── README.md
```

## 실행 (백엔드)
```
cd server
npm install
npm start
```
- 기본 포트: 4000
- 상태 확인: http://localhost:4000/health

## React 프론트엔드
- `client/`에서 새로 생성 예정
- 예: `npm create vite@latest client -- --template react`

## Arduino
- `arduino/` 폴더에 스케치 보관
- 업로드는 Arduino IDE 또는 Arduino CLI로 진행
