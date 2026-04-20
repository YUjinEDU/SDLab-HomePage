import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import { members } from "@/lib/db/schema";
import { eq, asc, ne, count } from "drizzle-orm";
import type { Member } from "@/types";

function toMember(row: typeof members.$inferSelect): Member {
  return {
    id: String(row.id),
    slug: row.slug,
    nameKo: row.nameKo,
    nameEn: row.nameEn ?? "",
    group: row.group as Member["group"],
    position: row.position ?? "",
    department: row.department ?? "",
    image: row.image ?? null,
    email: row.email ?? null,
    links: (row.links as Member["links"]) ?? {},
    researchKeywords: row.researchKeywords ?? [],
    bio: row.bio ?? null,
    education: (row.education as Member["education"]) ?? [],
    career: (row.career as Member["career"]) ?? [],
    displayOrder: row.displayOrder ?? 0,
  };
}

export const getMembers = unstable_cache(
  async (): Promise<Member[]> => {
    const rows = await db
      .select()
      .from(members)
      .orderBy(asc(members.displayOrder));
    return rows.map(toMember);
  },
  ["members-all"],
  { tags: ["members"] },
);

/** Per-slug cache: each slug gets its own cache entry. */
export function getMemberBySlug(slug: string): Promise<Member | null> {
  return unstable_cache(
    async (): Promise<Member | null> => {
      const [row] = await db
        .select()
        .from(members)
        .where(eq(members.slug, slug))
        .limit(1);
      return row ? toMember(row) : null;
    },
    ["member-by-slug", slug],
    { tags: ["members"] },
  )();
}

/** Not cached — used in professor admin pages where freshness is required. */
export async function getMemberById(id: string): Promise<Member | null> {
  const [row] = await db
    .select()
    .from(members)
    .where(eq(members.id, Number(id)))
    .limit(1);
  return row ? toMember(row) : null;
}

export const getProfessor = unstable_cache(
  async (): Promise<Member | null> => {
    const [row] = await db
      .select()
      .from(members)
      .where(eq(members.group, "professor"))
      .orderBy(asc(members.displayOrder))
      .limit(1);
    return row ? toMember(row) : null;
  },
  ["members-professor"],
  { tags: ["members"] },
);

export const getAlumniCount = unstable_cache(
  async (): Promise<number> => {
    const [result] = await db
      .select({ count: count() })
      .from(members)
      .where(eq(members.group, "alumni"));
    return result?.count ?? 0;
  },
  ["members-alumni-count"],
  { tags: ["members"] },
);

export const getMemberStubs = unstable_cache(
  async (): Promise<Pick<Member, "id" | "nameKo" | "nameEn" | "slug">[]> => {
    const rows = await db
      .select({
        id: members.id,
        nameKo: members.nameKo,
        nameEn: members.nameEn,
        slug: members.slug,
      })
      .from(members)
      .orderBy(asc(members.displayOrder));
    return rows.map((r) => ({
      id: String(r.id),
      nameKo: r.nameKo,
      nameEn: r.nameEn ?? "",
      slug: r.slug,
    }));
  },
  ["members-stubs"],
  { tags: ["members"] },
);

export const getStudents = unstable_cache(
  async (): Promise<Member[]> => {
    const rows = await db
      .select()
      .from(members)
      .where(ne(members.group, "professor"))
      .orderBy(asc(members.displayOrder));
    return rows.map(toMember);
  },
  ["members-students"],
  { tags: ["members"] },
);
