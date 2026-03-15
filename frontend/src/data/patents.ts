import type { Patent } from "../types";

/** 특허 샘플 데이터 — 별도 patents 테이블로 분리됨 (Migration 005)
 * TODO: Phase 8에서 실제 DB 쿼리로 교체 예정 */
export const patents: Patent[] = [
  {
    id: "pat-1",
    slug: "iot-stream-context-recommendation",
    title: "[샘플] IoT 스트림 데이터 기반 상황인지 추천 시스템 및 그 방법",
    titleEn: null,
    inventors: ["김영국", "홍길동"],
    status: "등록",
    patentNumber: null,
    date: "2025-01-01",
    note: "본 발명은 IoT 센서에서 수집되는 실시간 스트림 데이터를 분석하여 사용자 상황에 맞는 추천을 제공하는 시스템 및 방법에 관한 것이다.",
    isPublic: true,
  },
  {
    id: "pat-2",
    slug: "bio-data-smart-farm-platform",
    title: "[샘플] 바이오 빅데이터 분석 기반 스마트팜 지능형 서비스 플랫폼",
    titleEn: null,
    inventors: ["김영국", "김샘플"],
    status: "등록",
    patentNumber: null,
    date: "2024-06-01",
    note: "본 발명은 바이오 빅데이터 분석 기술을 활용하여 스마트팜 환경에서 작물 생육 상태를 모니터링하고 최적의 재배 조건을 추천하는 지능형 서비스 플랫폼에 관한 것이다.",
    isPublic: true,
  },
  {
    id: "pat-3",
    slug: "water-quality-prediction-deep-learning",
    title: "[샘플] 딥러닝 기반 수질 예측 장치 및 방법",
    titleEn: null,
    inventors: ["김영국", "이테스트"],
    status: "출원",
    patentNumber: null,
    date: "2024-09-01",
    note: "본 발명은 환경 IoT 센서 네트워크에서 수집된 다중 센서 데이터를 딥러닝 모델로 분석하여 수질 오염을 사전 예측하는 장치 및 방법에 관한 것이다.",
    isPublic: true,
  },
];
