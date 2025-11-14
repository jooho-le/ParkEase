# ParkEase Server

초음파 센서와 LED 상태(켜짐/꺼짐)를 기록하고 조회하는 REST API입니다. Wi-Fi 없이도 PC ↔ 아두이노를 USB로 연결해 센서 값을 읽은 뒤 이 서버에 HTTP 요청만 보내면 됩니다. 외부 DB 대신 JSON 파일(`data/sensor-readings.json`)을 영속 저장소로 사용합니다.

## 폴더 구조
```
server/
├── data/
│   ├── sensor-readings.json   # 초음파/LED 기록
│   └── nfc-tags.json          # NFC 태그 히스토리
├── package.json               # Node 18+ 환경, 의존성 없이 실행 가능
└── src/
    └── server.js              # HTTP 서버와 라우팅, 저장소 로직
```

## 실행 방법
1. Node 18 이상이 설치되어 있는지 확인합니다.
2. 서버를 실행합니다.
   ```bash
   cd server
   npm start
   ```
   기본 포트는 `4000`이며 `PORT` 환경 변수를 통해 변경할 수 있습니다.

## REST API
| Method | Endpoint                 | 설명 |
|--------|--------------------------|------|
| GET    | `/health`                | 서버 상태 확인 |
| GET    | `/api/readings`          | 모든 거리/LED 기록 조회 |
| GET    | `/api/readings/latest`   | 가장 최근 거리/LED 기록 |
| POST   | `/api/readings`          | 새로운 거리/LED 기록 저장 |
| GET    | `/api/readings/:id`      | 특정 기록 조회 |
| DELETE | `/api/readings/:id`      | 특정 기록 삭제 |
| GET    | `/api/led-state`         | 최신 LED 상태만 요약 |
| GET    | `/api/nfc-tags`          | NFC 태그 히스토리 조회 |
| GET    | `/api/nfc-tags/latest`   | 가장 최근 태그 이벤트 |
| POST   | `/api/nfc-tags`          | 새 태그 이벤트 저장 |

### 예시 요청
센서 데이터 저장
```bash
curl -X POST http://localhost:4000/api/readings \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "gate-01",
    "distanceCm": 8.5,
    "thresholdCm": 10,
    "ledState": true,
    "metadata": {"note": "LED turned on"}
  }'
```
응답
```json
{
  "id": "8ad0...",
  "sensorId": "gate-01",
  "distanceCm": 8.5,
  "thresholdCm": 10,
  "ledState": true,
  "createdAt": "2024-05-01T08:15:22.000Z",
  "metadata": {"note": "LED turned on"}
}
```

NFC 태그 저장
```bash
curl -X POST http://localhost:4000/api/nfc-tags \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "04A2247B",
    "speakerTriggered": true,
    "metadata": {"note": "Entry gate"}
  }'
```
응답
```json
{
  "id": "0a12...",
  "cardId": "04A2247B",
  "speakerTriggered": true,
  "createdAt": "2024-05-01T08:20:10.000Z",
  "metadata": {"note": "Entry gate"}
}
```

## 아두이노/웹 연동 아이디어
- **아두이노 (USB 연결):** PC에서 `pyserial`/Processing 등으로 UNO의 시리얼 데이터를 읽고, 일정 거리 이하일 때 LED가 켜졌다는 여부(`ledState: true/false`)와 측정 거리/임계값을 `POST /api/readings`로 전송합니다. NFC 리더가 UNO에 붙어 있다면 카드 ID를 읽은 뒤 `POST /api/nfc-tags` 호출로 기록하세요. 스피커 동작 여부는 `speakerTriggered` 필드에 담아 둘 수 있습니다.
- **웹/모바일 앱:** `/api/readings` 목록을 사용해 히스토리를 보여주고 `/api/led-state`로 현재 LED 상태를, `/api/nfc-tags`/`/api/nfc-tags/latest`로 출입 기록을 확인합니다.
- **데이터 정제:** `metadata` 필드에 배터리 전압, 센서 상태 등을 함께 전달해 후처리 시 활용할 수 있습니다.

추후 실제 RDBMS(MySQL, PostgreSQL 등)로 교체할 때는 `SensorRepository` 클래스만 해당 DB 로직으로 바꾸면 나머지 API 코드는 그대로 재사용할 수 있습니다.
