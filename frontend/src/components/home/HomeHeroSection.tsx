import Link from "next/link";
import { NetworkBackground } from "./NetworkBackground";

export function HomeHeroSection() {
  return (
    <section className="relative bg-[#fafdfb] text-foreground overflow-hidden min-h-[640px] flex items-center border-b border-border">
      {/* Interactive Node/Network Pattern mapping to "AI in various domains" */}
      <NetworkBackground />

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

          <p className="text-[16px] sm:text-[18px] text-text-secondary font-medium leading-[1.7] mb-12 max-w-xl">
            이론적 모델 고도화를 넘어, 현장에서 마주하는 문제를 제대로 정의하고
            각 도메인에 합리적으로 AI를 적용하여{" "}
            <strong className="text-foreground font-semibold">
              실질적인 가치
            </strong>
            를 창출하는 실용적 연구를 지향합니다.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/research"
              className="inline-flex items-center px-7 py-3.5 rounded-lg bg-primary text-white text-[15px] font-bold hover:bg-primary-dark transition-all duration-200 shadow-md shadow-primary/20"
            >
              우리의 연구 분야
              <svg
                className="ml-2 opacity-90"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/members"
              className="inline-flex items-center px-7 py-3.5 rounded-lg border border-border bg-white text-foreground text-[15px] font-semibold hover:border-primary/50 hover:bg-primary-muted transition-all duration-200 shadow-sm"
            >
              연구진 소개
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
