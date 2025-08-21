package com.bemyguest.backend.guesthouse.entity;

// ✅ 한글 Enum 그대로 사용 (Converter 불필요)
//  - DB 컬럼은 VARCHAR(20) 정도로 두고 @Enumerated(EnumType.STRING)으로 저장
//  - MySQL ENUM 타입을 이미 쓰고 있다면, ENUM literal이 아래 값과 정확히 일치해야 함
public enum Region {
    서울,
    부산,
    대구,
    인천,
    광주,
    대전,
    울산,
    세종,
    경기,
    강원,
    충북,
    충남,
    전북,
    전남,
    경북,
    경남,
    제주
}
