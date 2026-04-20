import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/drizzle";
import { members as membersTable, publications as publicationsTable, projects as projectsTable, news as newsTable } from "@/lib/db/schema";
import { count } from "drizzle-orm";

type StatCard = {
  label: string;
  count: number;
  href: string;
};

export default async function ProfessorDashboard() {
  const session = await auth();

  const [membersResult, publicationsResult, projectsResult, newsResult] = await Promise.all([
    db.select({ count: count() }).from(membersTable),
    db.select({ count: count() }).from(publicationsTable),
    db.select({ count: count() }).from(projectsTable),
    db.select({ count: count() }).from(newsTable),
  ]);

  const members = { count: membersResult[0]?.count ?? 0 };
  const publications = { count: publicationsResult[0]?.count ?? 0 };
  const projects = { count: projectsResult[0]?.count ?? 0 };
  const news = { count: newsResult[0]?.count ?? 0 };

  const stats: StatCard[] = [
    {
      label: "멤버",
      count: members.count ?? 0,
      href: "/professor/members",
    },
    {
      label: "논문",
      count: publications.count ?? 0,
      href: "/professor/publications",
    },
    {
      label: "프로젝트",
      count: projects.count ?? 0,
      href: "/professor/projects",
    },
    {
      label: "소식",
      count: news.count ?? 0,
      href: "/professor/news",
    },
  ];

  const quickLinks = [
    { href: "/professor/members", label: "멤버 관리" },
    { href: "/professor/publications", label: "논문 관리" },
    { href: "/professor/projects", label: "프로젝트 관리" },
    { href: "/professor/patents", label: "특허 관리" },
    { href: "/professor/news", label: "소식 관리" },
    { href: "/professor/contact", label: "연락처 관리" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">
          {session?.user?.email ?? "관리자"}님, 안녕하세요.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-emerald-700 mt-2 group-hover:text-emerald-600 transition-colors">
              {stat.count}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 이동</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
