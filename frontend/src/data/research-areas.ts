import type { ResearchArea } from "../types";

export const researchAreas: ResearchArea[] = [
  {
    id: "ra-1",
    slug: "smart-computing",
    title: "실시간 스마트 컴퓨팅 응용",
    shortDescription:
      "실시간 스트림 데이터 처리 및 상황인지 기반의 지능형 서비스 연구",
    fullDescription:
      "실시간 스트림 데이터 처리, 추천시스템, 상황인지 컴퓨팅, IoT 기술을 활용하여 스마트팩토리, 스마트모빌리티, 스마트시티 등 다양한 분야에 적용 가능한 지능형 서비스를 연구합니다.",
    icon: "cpu",
    image: null,
    keywords: ["추천시스템", "실시간 스트림 데이터 처리", "상황인지", "IoT"],
    applications: ["스마트팩토리", "스마트모빌리티", "스마트시티"],
    displayOrder: 1,
  },
  {
    id: "ra-2",
    slug: "bio-ai",
    title: "바이오AI융합 연구",
    shortDescription: "바이오 빅데이터와 AI 기술을 융합한 지능형 서비스 연구",
    fullDescription:
      "스마트팜, 바이오 빅데이터, 지능형 서비스 등의 키워드를 중심으로 바이오 분야와 AI 기술의 융합을 통해 신약개발, 스마트팜 등의 응용 분야에 기여하는 연구를 수행합니다.",
    icon: "dna",
    image: null,
    keywords: ["스마트팜", "바이오 빅데이터", "지능형 서비스"],
    applications: ["신약개발", "스마트팜"],
    displayOrder: 2,
  },
  {
    id: "ra-3",
    slug: "environmental-it",
    title: "환경IT융합 연구",
    shortDescription: "IoT 및 데이터 분석 기반의 환경 모니터링 및 관리 연구",
    fullDescription:
      "수질관리, 대기오염, 미세먼지 등 환경 문제 해결을 위해 IoT 센서 데이터 수집 및 분석 기술을 활용한 환경 모니터링 시스템을 연구합니다.",
    icon: "leaf",
    image: null,
    keywords: ["수질관리", "대기오염", "미세먼지", "IoT"],
    applications: ["수질관리", "대기오염 모니터링"],
    displayOrder: 3,
  },
];
