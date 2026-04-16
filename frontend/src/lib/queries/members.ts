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

export async function getMembers(): Promise<Member[]> {
  const rows = await db
    .select()
    .from(members)
    .orderBy(asc(members.displayOrder));
  return rows.map(toMember);
}

export async function getMemberBySlug(slug: string): Promise<Member | null> {
  const [row] = await db
    .select()
    .from(members)
    .where(eq(members.slug, slug))
    .limit(1);
  return row ? toMember(row) : null;
}

export async function getMemberById(id: string): Promise<Member | null> {
  const [row] = await db
    .select()
    .from(members)
    .where(eq(members.id, Number(id)))
    .limit(1);
  return row ? toMember(row) : null;
}

export async function getProfessor(): Promise<Member | null> {
  const [row] = await db
    .select()
    .from(members)
    .where(eq(members.group, "professor"))
    .orderBy(asc(members.displayOrder))
    .limit(1);
  return row ? toMember(row) : null;
}

export async function getAlumniCount(): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(members)
    .where(eq(members.group, "alumni"));
  return result?.count ?? 0;
}

export async function getMemberStubs(): Promise<
  Pick<Member, "id" | "nameKo" | "nameEn" | "slug">[]
> {
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
}

export async function getStudents(): Promise<Member[]> {
  const rows = await db
    .select()
    .from(members)
    .where(ne(members.group, "professor"))
    .orderBy(asc(members.displayOrder));
  return rows.map(toMember);
}
