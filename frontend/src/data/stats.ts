export const labStats = [
  { value: "1996", label: "연구실 설립" },
  { value: "14", label: "기술이전 건수" },
];

export const groupLabels: Record<string, string> = {
  professor: "지도교수",
  phd: "박사과정",
  ms: "석사과정",
  combined: "석박통합과정",
  undergraduate: "학부연구생",
  alumni: "졸업생",
};

/** Short labels for tabs (no trailing "과정"/"연구생") */
export const groupLabelsShort: Record<string, string> = {
  professor: "교수",
  phd: "박사",
  ms: "석사",
  combined: "석박통합",
  undergraduate: "학부",
  alumni: "졸업생",
};
