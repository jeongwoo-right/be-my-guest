package com.bemyguest.backend.guesthouse.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Region {
    SEOUL("서울"),
    GYEONGI("경기"),
    INCHEON("인천"),
    BUSAN("부산"),
    DAEGU("대구"),
    DAEJEON("대전"),
    GWANGJU("광주"),
    ULSAN("울산"),
    SEJONG("세종"),
    GANGWON("강원"),
    CHUNGBUK("충북"),
    CHUNGNAM("충남"),
    JEONBUK("전북"),
    JEONNAM("전남"),
    GYEONGBUK("경북"),
    GYEONGNAM("경남"),
    JEJU("제주");

    private final String kr;
    Region(String kr) { this.kr = kr; }

    /** If you return Region in your DTO, this makes JSON emit the Korean label (e.g., "서울"). */
    @JsonValue
    public String getKr() { return kr; }

    public static Region fromKr(String kr) {
        for (Region r : values()) if (r.kr.equals(kr)) return r;
        throw new IllegalArgumentException("Unknown region: " + kr);
    }
}
