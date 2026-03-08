type Props = {
  address: string;
  building: string;
};

type Direction = {
  icon: string;
  label: string;
  description: string;
};

const directions: Direction[] = [
  {
    icon: "🚇",
    label: "지하철",
    description:
      "지하철 1호선 신성역 1번 출구 → 충남대학교 방면 버스 이용 또는 도보 약 20분",
  },
  {
    icon: "🚌",
    label: "버스",
    description: "충남대학교 정문 정류장 하차 → 공과대학 방면 도보 약 5분",
  },
  {
    icon: "🚗",
    label: "자가용",
    description:
      "대전-통영고속도로 유성IC → 충남대학교 방면 → 공대 5호관 주차장 이용",
  },
];

export function DirectionsSection({ address, building }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-xl font-bold text-foreground mb-2">오시는 길</h2>
      <p className="text-sm text-text-secondary mb-6">
        {address} ({building})
      </p>

      <div className="flex flex-col gap-4">
        {directions.map((d) => (
          <div key={d.label} className="flex items-start gap-3">
            <span
              className="text-xl leading-none mt-0.5 flex-shrink-0"
              aria-hidden="true"
            >
              {d.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{d.label}</p>
              <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                {d.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
