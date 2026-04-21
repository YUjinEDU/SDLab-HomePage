"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";

type SubLink = {
  label: string;
  href: string;
  description?: string;
};

type NavItem = {
  category: string;
  href: string;
  subLinks?: SubLink[];
};

const navigationConfig: NavItem[] = [
  {
    category: "Members",
    href: "/members",
    subLinks: [
      {
        label: "Members",
        href: "/members",
        description: "Professor & Researchers",
      },
    ],
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

export function MainNavigation() {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  function handleMouseEnter(index: number) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(index);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 150);
  }

  // Close on route change
  useEffect(() => {
    setOpenIndex(null);
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav ref={navRef} className="hidden md:flex items-center h-full">
      <ul className="flex items-center gap-1 lg:gap-2 h-full">
        {navigationConfig.map((item, index) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/") ||
            item.subLinks?.some(
              (sub) =>
                pathname === sub.href || pathname.startsWith(sub.href + "/"),
            );

          const hasDropdown = item.subLinks && item.subLinks.length > 0;
          const isOpen = openIndex === index;

          return (
            <li
              key={item.category}
              className="relative h-full flex items-center"
              onMouseEnter={() => hasDropdown && handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className={`relative h-full flex items-center gap-1 px-3 lg:px-4 text-[18px] font-semibold transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-gray-900 hover:text-primary"
                }`}
              >
                {item.category}
                {hasDropdown && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                )}
              </Link>

              {/* Dropdown */}
              {hasDropdown && (
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                    isOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-xl border border-border shadow-lg shadow-black/5 py-2 min-w-[200px]">
                    {item.subLinks!.map((sub) => {
                      const isSubActive =
                        pathname === sub.href ||
                        pathname.startsWith(sub.href + "/");

                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`flex flex-col px-4 py-2.5 transition-colors ${
                            isSubActive
                              ? "bg-primary-muted text-primary"
                              : "text-foreground hover:bg-surface hover:text-primary"
                          }`}
                        >
                          <span className="text-[13px] font-semibold">
                            {sub.label}
                          </span>
                          {sub.description && (
                            <span className="text-[11px] text-text-secondary mt-0.5">
                              {sub.description}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
