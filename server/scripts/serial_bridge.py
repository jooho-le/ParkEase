#!/usr/bin/env python3
import argparse
import json
import sys
import urllib.error
import urllib.request

try:
    import serial
except ImportError:
    print("pyserial is required. Install with: pip install pyserial", file=sys.stderr)
    sys.exit(1)


def post_json(url, payload, timeout):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        response.read()


def main():
    parser = argparse.ArgumentParser(
        description="Bridge Arduino serial JSON lines to ParkEase API."
    )
    parser.add_argument("--port", required=True, help="Serial port (e.g., /dev/tty.usbmodem1101)")
    parser.add_argument("--baud", type=int, default=9600, help="Serial baud rate")
    parser.add_argument(
        "--server",
        default="http://localhost:4000",
        help="Server base URL (default: http://localhost:4000)",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=5.0,
        help="HTTP request timeout seconds",
    )
    args = parser.parse_args()

    try:
        ser = serial.Serial(args.port, args.baud, timeout=1)
    except serial.SerialException as exc:
        print(f"Failed to open serial port: {exc}", file=sys.stderr)
        sys.exit(1)

    print(f"Listening on {args.port} @ {args.baud}bps")
    print(f"Posting to {args.server}")

    while True:
        try:
            line = ser.readline().decode("utf-8", errors="ignore").strip()
            if not line:
                continue
            print(f"Raw: {line}")
            if not line.startswith("{"):
                continue

            try:
                payload = json.loads(line)
            except json.JSONDecodeError:
                continue

            message_type = payload.pop("type", None)
            if message_type == "reading":
                endpoint = "/api/readings"
            elif message_type == "nfc":
                endpoint = "/api/nfc-tags"
            else:
                print(f"Ignored message type: {message_type}")
                continue

            post_json(args.server + endpoint, payload, args.timeout)
            print(f"Sent {message_type}: {payload}")
        except KeyboardInterrupt:
            print("\nStopped.")
            break
        except urllib.error.URLError as exc:
            print(f"HTTP error: {exc}", file=sys.stderr)
        except Exception as exc:
            print(f"Unexpected error: {exc}", file=sys.stderr)


if __name__ == "__main__":
    main()
