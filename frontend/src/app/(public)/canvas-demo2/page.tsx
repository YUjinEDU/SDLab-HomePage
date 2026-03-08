import { NetworkBackgroundDemo } from "@/components/home/NetworkBackgroundDemo";
import Link from "next/link";

export default function CanvasDemoPage() {
  return (
    <main className="relative min-h-screen bg-[#fafdfb] text-foreground overflow-hidden flex items-center">
      {/* Refined Interactive Canvas */}
      <NetworkBackgroundDemo />

      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Smart Data Lab"
            width={160}
            height={50}
            className="mb-8 opacity-90"
          />

          <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.25rem] font-extrabold leading-[1.1] mb-4 tracking-tight">
            <span className="text-gradient">스마트데이터연구실</span>
          </h1>
          <h2 className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] font-bold leading-tight mb-8 tracking-tight text-foreground/80">
            문제 정의부터 실제 가치 창출까지
          </h2>

          <p className="text-[16px] sm:text-[18px] text-slate-500 font-medium leading-[1.7] mb-12 max-w-xl">
            이론적 모델 고도화를 넘어, 현장에서 마주하는 문제를 제대로 정의하고
            각 도메인에 합리적으로 AI를 적용하여{" "}
            <strong className="text-foreground font-semibold">
              실질적인 가치
            </strong>
            를 창출하는 실용적 연구를 지향합니다.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center px-7 py-3.5 rounded-lg bg-emerald-600 text-white text-[15px] font-bold hover:bg-emerald-700 transition-all duration-200 shadow-md shadow-emerald-200"
            >
              ← Back to Home
            </Link>
            <button className="inline-flex items-center px-7 py-3.5 rounded-lg border border-border bg-white text-foreground text-[15px] font-semibold hover:border-emerald-500/50 hover:bg-emerald-50 transition-all duration-200 shadow-sm">
              Trigger Wave Effect
            </button>
          </div>
        </div>
      </div>

      {/* Narrative Legend Overlay */}
      <div className="absolute bottom-10 left-10 p-4 border-l-2 border-emerald-500 bg-white/40 backdrop-blur-sm rounded-r-lg z-20 pointer-events-none hidden md:block">
        <p className="text-xs font-bold text-emerald-900 tracking-widest mb-1 uppercase">
          Story Logic
        </p>
        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
          Green Dashed Line: Raw Data Pipeline (Forward)
          <br />
          Blue Dashed Line: Optimized Solution Feedback (Backward)
        </p>
      </div>
    </main>
  );
}
