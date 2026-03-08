import { EcosystemDemo } from "@/components/home/EcosystemDemo";
import { IsometricDemo } from "@/components/home/IsometricDemo";

export default function DemoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Network Canvas 설계 데모
        </h1>
        <p className="text-slate-600">
          연구실의 정체성을 담은 새로운 인터랙티브 캔버스 설계안의
          프로토타입입니다. 메인 페이지 통합 전, 각 요소의 작동 방식을 확인하기
          위한 별도 페이지입니다.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-bold">
              2
            </span>
            Structural Value Stack (3D Isometric)
          </h2>
          <IsometricDemo />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
              1
            </span>
            Intelligent Ecosystem Prototype (2D)
          </h2>
          <EcosystemDemo />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-emerald-600 mb-3">Semantic Icons</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              데이터 허브(실린더), AI 브레인(헥사곤 신경망), 도메인 특화
              아이콘(Bio/Env/City)들을 통해 연구실의 실제 연구 범위를
              시각화합니다.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-blue-600 mb-3">Narrative Flow</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              패킷이 이동할 때 목적지가 도메인 응용 영역(Bio 등)일 경우 황색광을
              띄며 '가치가 창출되는 과정'을 은유적으로 표현합니다.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-amber-600 mb-3">Adaptive Pulse</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              각 노드는 고유의 리듬으로 맥동(Pulse)하며, 데이터가 실시간으로
              처리되고 살아있는 시스템임을 암시합니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
