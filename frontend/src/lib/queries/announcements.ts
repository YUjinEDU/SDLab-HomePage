import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import { announcements, announcementAttachments, members } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export type AnnouncementRow = {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  authorId: number | null;
  authorName: string | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AnnouncementWithAttachments = AnnouncementRow & {
  attachments: Array<{
    id: number;
    announcementId: number;
    fileName: string;
    filePath: string;
    fileSize: number | null;
    mimeType: string | null;
    uploadedAt: Date;
  }>;
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
    viewCount: a.viewCount,
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

export function getAnnouncementById(id: number): Promise<AnnouncementWithAttachments | null> {
  return unstable_cache(
    async (): Promise<AnnouncementWithAttachments | null> => {
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
      const attachments = await db
        .select()
        .from(announcementAttachments)
        .where(eq(announcementAttachments.announcementId, id))
        .orderBy(announcementAttachments.uploadedAt);
      return { ...toRow(row.announcement, row.authorName ?? null), attachments };
    },
    ["announcement-by-id", String(id)],
    { tags: ["announcements"] },
  )();
}
