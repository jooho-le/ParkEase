# ParkEase Server

초음파 센서와 LED 상태(켜짐/꺼짐)를 기록하고 조회하는 REST API입니다. Wi-Fi 없이도 PC ↔ 아두이노를 USB로 연결해 센서 값을 읽은 뒤 이 서버에 HTTP 요청만 보내면 됩니다. 외부 DB 대신 JSON 파일(`data/sensor-readings.json`)을 영속 저장소로 사용합니다.

## 폴더 구조
```
server/
├── data/
│   └── sensor-readings.json   # 센서 데이터가 누적되는 파일 기반 DB
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
| Method | Endpoint                | 설명 |
|--------|-------------------------|------|
| GET    | `/health`               | 서버 상태 확인 |
| GET    | `/api/readings`         | 모든 기록(거리·LED 상태) 조회 |
| GET    | `/api/readings/latest`  | 가장 최근 기록 조회 |
| POST   | `/api/readings`         | 새로운 기록 저장 |
| GET    | `/api/readings/:id`     | 특정 기록 조회 |
| DELETE | `/api/readings/:id`     | 특정 기록 삭제 |
| GET    | `/api/led-state`        | 최신 LED 상태만 요약해서 조회 |

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

## 아두이노/웹 연동 아이디어
- **아두이노 (USB 연결):** PC에서 `pyserial`/Processing 등으로 UNO의 시리얼 데이터를 읽고, 일정 거리 이하일 때 LED가 켜졌다는 여부(`ledState: true/false`)와 측정 거리/임계값을 `POST /api/readings`로 전송합니다.
- **웹/모바일 앱:** `/api/readings` 목록을 사용해 히스토리를 보여주고, `/api/led-state` 또는 `/api/readings/latest`를 활용해 현재 LED 상태를 실시간으로 표시합니다.
- **데이터 정제:** `metadata` 필드에 배터리 전압, 센서 상태 등을 함께 전달해 후처리 시 활용할 수 있습니다.

추후 실제 RDBMS(MySQL, PostgreSQL 등)로 교체할 때는 `SensorRepository` 클래스만 해당 DB 로직으로 바꾸면 나머지 API 코드는 그대로 재사용할 수 있습니다.
