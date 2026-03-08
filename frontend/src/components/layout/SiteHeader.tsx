"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { MainNavigation } from "@/components/navigation/MainNavigation";
import { MobileNavigationDrawer } from "@/components/navigation/MobileNavigationDrawer";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/60">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Smart Data Lab"
              width={130}
              height={40}
              className="object-contain"
            />
            <span className="hidden sm:block text-[11px] text-text-secondary leading-tight border-l border-border pl-3 font-medium">
              충남대학교
              <br />
              컴퓨터융합학부
            </span>
          </Link>

          <MainNavigation />

          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </Container>

      <MobileNavigationDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
