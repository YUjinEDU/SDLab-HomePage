"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SubLink = {
  label: string;
  href: string;
};

type MobileNavItem = {
  category: string;
  href: string;
  subLinks?: SubLink[];
};

const mobileNavConfig: MobileNavItem[] = [
  {
    category: "Members",
    href: "/members",
    subLinks: [{ label: "Members", href: "/members" }],
  },
  {
    category: "Research",
    href: "/research",
  },
  {
    category: "Projects",
    href: "/projects",
  },
  {
    category: "Publications",
    href: "/publications",
  },
  {
    category: "Patents",
    href: "/patents",
  },
  {
    category: "Demo",
    href: "/demos",
  },
  {
    category: "News",
    href: "/news",
  },
  {
    category: "Contact",
    href: "/contact",
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileNavigationDrawer({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function toggleExpand(index: number) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link href="/" onClick={onClose}>
            <Image
              src="/images/logo.png"
              alt="Smart Data Lab"
              width={120}
              height={34}
              className="object-contain"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-foreground transition-colors"
            aria-label="메뉴 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col mt-2">
          {mobileNavConfig.map((item, index) => {
            const hasSubLinks = item.subLinks && item.subLinks.length > 0;
            const isExpanded = expandedIndex === index;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              item.subLinks?.some(
                (sub) =>
                  pathname === sub.href || pathname.startsWith(sub.href + "/"),
              );

            if (!hasSubLinks) {
              return (
                <Link
                  key={item.category}
                  href={item.href}
                  onClick={onClose}
                  className={`px-6 py-3.5 text-sm font-medium border-l-2 transition-colors ${
                    isActive
                      ? "border-primary text-primary bg-primary-muted/60"
                      : "border-transparent text-foreground hover:text-primary hover:bg-surface"
                  }`}
                >
                  {item.category}
                </Link>
              );
            }

            return (
              <div key={item.category}>
                {/* Category header with expand toggle */}
                <button
                  onClick={() => toggleExpand(index)}
                  className={`w-full px-6 py-3.5 text-sm font-medium border-l-2 transition-colors flex items-center justify-between ${
                    isActive
                      ? "border-primary text-primary bg-primary-muted/60"
                      : "border-transparent text-foreground hover:text-primary hover:bg-surface"
                  }`}
                >
                  {item.category}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {/* Sub links */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {item.subLinks!.map((sub) => {
                    const isSubActive =
                      pathname === sub.href ||
                      pathname.startsWith(sub.href + "/");

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onClose}
                        className={`block pl-10 pr-6 py-2.5 text-[13px] font-medium transition-colors ${
                          isSubActive
                            ? "text-primary"
                            : "text-text-secondary hover:text-primary"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
                          {sub.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
