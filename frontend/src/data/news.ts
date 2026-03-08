import type { NewsItem } from "../types";

export const newsItems: NewsItem[] = [
  {
    id: "news-1",
    slug: "icde-2025-paper-accepted",
    title: "ICDE 2025 논문 게재 승인",
    summary:
      "정현우 학생의 'Deep Learning-Based Water Quality Prediction Using Multi-Sensor IoT Data' 논문이 ICDE 2025에 게재 승인되었습니다.",
    category: "acceptance",
    date: "2025-01-15",
    isPinned: false,
    relatedProjectIds: ["proj-3"],
    relatedPublicationIds: ["pub-2"],
  },
  {
    id: "news-2",
    slug: "best-paper-award-2024",
    title: "한국정보과학회 우수논문상 수상",
    summary:
      "이민수 학생이 한국정보과학회 2024 추계학술발표대회에서 실시간 스트림 처리 관련 연구로 우수논문상을 수상하였습니다.",
    category: "award",
    date: "2024-12-05",
    isPinned: false,
    relatedProjectIds: ["proj-1"],
    relatedPublicationIds: [],
  },
  {
    id: "news-3",
    slug: "2025-graduate-recruitment",
    title: "2025년도 대학원생 모집 안내",
    summary:
      "스마트데이터연구실에서 2025년도 석사/박사과정 대학원생을 모집합니다. 관심 있는 분은 김영국 교수님께 연락 바랍니다.",
    category: "recruitment",
    date: "2025-02-01",
    isPinned: true,
    relatedProjectIds: [],
    relatedPublicationIds: [],
  },
  {
    id: "news-4",
    slug: "ai-convergence-seminar-2025",
    title: "AI융합 세미나 개최 안내",
    summary:
      "2025년 3월 AI융합연구센터 주관 춘계 세미나가 충남대학교 공대 5호관에서 개최됩니다.",
    category: "event",
    date: "2025-03-01",
    isPinned: false,
    relatedProjectIds: ["proj-1"],
    relatedPublicationIds: [],
  },
];
