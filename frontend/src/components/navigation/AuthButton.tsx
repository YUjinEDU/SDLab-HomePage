"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  if (status === "loading") {
    return <div className="w-16 h-8" />;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="text-[13px] font-medium text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-muted"
      >
        로그인
      </Link>
    );
  }

  const user = session.user;
  const displayName =
    user.email?.split("@")[0] ?? "사용자";
  const role = user.role;

  async function handleLogout() {
    await signOut({ redirect: false });
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-muted"
      >
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{displayName}</span>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl border border-border shadow-lg shadow-black/5 py-2 min-w-[160px]">
            <div className="px-4 py-2 border-b border-border/60">
              <p className="text-[12px] text-text-secondary truncate">
                {user.email}
              </p>
            </div>
            <Link
              href="/internal"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-[13px] text-foreground hover:bg-surface hover:text-primary transition-colors"
            >
              내부 포털
            </Link>
            {(role === "professor" || role === "admin") && (
              <Link
                href="/professor"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-[13px] text-foreground hover:bg-surface hover:text-primary transition-colors"
              >
                관리 페이지
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  );
}
