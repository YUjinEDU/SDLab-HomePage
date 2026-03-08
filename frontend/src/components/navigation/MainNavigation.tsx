"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Define the full navigation structure, minus Seminar
const navigationConfig = [
  {
    category: "Members",
    href: "/members",
    subLinks: [
      { label: "Professor", href: "/members#professor" },
      { label: "Students", href: "/members#students" },
      { label: "Alumni", href: "/members#alumni" },
    ],
  },
  {
    category: "Research",
    href: "/research",
    subLinks: [
      { label: "Research Areas", href: "/research" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    category: "Publications",
    href: "/publications",
    subLinks: [
      { label: "Selected Paper", href: "/publications?filter=featured" },
      { label: "Publications", href: "/publications" },
    ],
  },
  {
    category: "Board",
    href: "/board",
    subLinks: [
      { label: "News", href: "/board/news" },
      { label: "Album", href: "/board/album" },
    ],
  },
  {
    category: "Live Demo",
    href: "/live-demo",
  },
  {
    category: "Resource",
    href: "/resource",
  },
  {
    category: "Contact",
    href: "/contact",
    subLinks: [
      { label: "Apply", href: "/contact/apply" },
      { label: "FAQ", href: "/contact/faq" },
    ],
  },
];

export function MainNavigation() {
  const pathname = usePathname();
  const [isHovering, setIsHovering] = useState(false);

  // We only show the mega menu if at least one category has subLinks
  const hasSubLinks = navigationConfig.some((item) => item.subLinks?.length);

  return (
    <nav
      className="hidden md:flex items-center h-full group/nav relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <ul className="flex items-center gap-6 lg:gap-8 h-full relative z-50">
        {navigationConfig.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.category} className="h-full flex items-center">
              <Link
                href={item.href}
                className={`relative h-full flex items-center px-2 text-[15px] font-medium transition-colors ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                {item.category}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Full Width Mega Menu Wrapper */}
      {hasSubLinks && (
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-[1200px] bg-white border-t border-b border-border shadow-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex justify-center z-40 ${
            isHovering
              ? "max-h-[400px] opacity-100 py-8"
              : "max-h-0 opacity-0 py-0 border-y-0"
          }`}
        >
          <div className="flex gap-6 lg:gap-8 w-full px-4 sm:px-6 lg:px-8 max-w-7xl justify-end">
            {/* We offset the grid to align roughly with the nav items above, or we just display a clean grid */}
            <div className="flex gap-12 lg:gap-16">
              {navigationConfig.map((item) => {
                if (!item.subLinks || item.subLinks.length === 0) return null;

                return (
                  <div
                    key={item.category}
                    className="flex flex-col min-w-[120px]"
                  >
                    <h3 className="text-sm font-bold text-foreground mb-4 border-b border-border pb-2 inline-block">
                      {item.category}
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {item.subLinks.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            href={sub.href}
                            className="text-[14px] text-text-secondary hover:text-primary transition-colors flex items-center"
                          >
                            <span className="w-1 h-1 rounded-full bg-border mr-2 group-hover:bg-primary transition-colors"></span>
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
