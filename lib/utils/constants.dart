import 'package:flutter/material.dart';

/*
 * ==========================================
 * [앱 전역 상수: constants.dart]
 * 전북대학교(JBNU) 테마 색상, 폰트 스타일, API 엔드포인트 등을 관리합니다.
 * 이곳에서 색상을 변경하면 앱 전체에 반영됩니다.
 * ==========================================
 */

// --- JBNU Theme Colors ---
// 전북대학교 UI의 메인 색상 (짙은 녹색)
const Color kPrimaryColor = Color(0xFF005936); 
// 포인트 색상 (밝은 연두색/녹색)
const Color kAccentColor = Color(0xFF8DC63F);
// 앱 배경색 (눈이 편안한 연한 회색)
const Color kBackgroundColor = Color(0xFFF4F6F9);
// 카드 및 컨테이너 배경색 (흰색)
const Color kCardColor = Colors.white;

// --- Text Colors ---
const Color kTextColor = Colors.black87;      // 기본 텍스트
const Color kSubTextColor = Color(0xFF6E6E6E); // 보조 설명 텍스트

// --- Status Colors (주차 상태) ---
const Color kAvailableColor = Color(0xFF4CAF50); // 여유 (녹색)
const Color kWarningColor = Color(0xFFFF9800);   // 혼잡 (주황색)
const Color kFullColor = Color(0xFFF44336);      // 만차 (빨간색)

// --- Text Styles ---
// 화면 제목 스타일
const TextStyle kHeadlineStyle = TextStyle(
  fontSize: 24,
  fontWeight: FontWeight.bold,
  color: kPrimaryColor,
);

// 카드 내부 제목 스타일
const TextStyle kCardTitleStyle = TextStyle(
  fontSize: 18,
  fontWeight: FontWeight.bold,
  color: kTextColor,
);

// 본문 텍스트 스타일
const TextStyle kBodyStyle = TextStyle(
  fontSize: 16,
  color: kTextColor,
);

// 작은 설명 텍스트 스타일
const TextStyle kSubBodyStyle = TextStyle(
  fontSize: 14,
  color: kSubTextColor,
);

// --- API Constants ---
// 실제 백엔드 서버 주소 (기획서의 API Gateway)
const String kApiBaseUrl = "http://localhost:4000";
