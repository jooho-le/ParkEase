import 'package:flutter/material.dart';
import 'package:webui/utils/constants.dart';

/*
 * ==========================================
 * [유틸리티 헬퍼: helpers.dart]
 * 앱 전역에서 반복적으로 사용되는 로직(계산, 포맷팅)을 함수로 분리했습니다.
 * ==========================================
 */

/// 주차장의 혼잡도(여유 공간 비율)에 따라 상태 색상을 반환합니다.
/// [available]: 남은 자리, [total]: 전체 자리
Color getStatusColor(int available, int total) {
  if (total == 0) return kSubTextColor;
  if (available == 0) return kFullColor; // 만차

  double ratio = available / total;
  
  // 남은 자리가 20% 이하이면 혼잡(주황색)
  if (ratio <= 0.2) {
    return kWarningColor;
  }
  // 그 외에는 여유(녹색)
  return kAvailableColor;
}

/// 날짜(DateTime)를 보기 좋은 문자열로 변환합니다.
String formatTimestamp(DateTime dateTime) {
  return "${dateTime.month}월 ${dateTime.day}일 ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')} 기준";
}