import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import { announcements, members } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export type AnnouncementRow = {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  authorId: number | null;
  authorName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function toRow(
  a: typeof announcements.$inferSelect,
  authorName: string | null,
): AnnouncementRow {
  return {
    id: a.id,
    title: a.title,
    content: a.content,
    isPinned: a.isPinned,
    authorId: a.authorId,
    authorName,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

export const getAnnouncements = unstable_cache(
  async (): Promise<AnnouncementRow[]> => {
    const rows = await db
      .select({
        announcement: announcements,
        authorName: members.nameKo,
      })
      .from(announcements)
      .leftJoin(members, eq(announcements.authorId, members.id))
      .orderBy(
        desc(announcements.isPinned),
        desc(announcements.createdAt),
      );
    return rows.map((r) => toRow(r.announcement, r.authorName ?? null));
  },
  ["announcements-all"],
  { tags: ["announcements"] },
);

export function getAnnouncementById(id: number): Promise<AnnouncementRow | null> {
  return unstable_cache(
    async (): Promise<AnnouncementRow | null> => {
      const [row] = await db
        .select({
          announcement: announcements,
          authorName: members.nameKo,
        })
        .from(announcements)
        .leftJoin(members, eq(announcements.authorId, members.id))
        .where(eq(announcements.id, id))
        .limit(1);
      if (!row) return null;
      return toRow(row.announcement, row.authorName ?? null);
    },
    ["announcement-by-id", String(id)],
    { tags: ["announcements"] },
  )();
}
