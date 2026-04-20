import { describe, it, expect, vi, beforeEach } from "vitest";
import * as permissions from "@/lib/permissions";

// ─── Permissions mock ──────────────────────────────────────────────────────
vi.mock("@/lib/permissions", () => ({
  assertRole: vi.fn(),
}));

// ─── next/cache mock ───────────────────────────────────────────────────────
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// ─── Drizzle mock ───────────────────────────────────────────────────────────
// insert().values().returning() → [{ id: 1 }]
// update().set().where()        → []
// delete().where()              → []
const mockReturning = vi.hoisted(() => vi.fn().mockResolvedValue([{ id: 1 }]));
const mockValues    = vi.hoisted(() => vi.fn().mockReturnValue({ returning: mockReturning }));
const mockInsert    = vi.hoisted(() => vi.fn().mockReturnValue({ values: mockValues }));
const mockWhere     = vi.hoisted(() => vi.fn().mockResolvedValue([]));
const mockSet       = vi.hoisted(() => vi.fn().mockReturnValue({ where: mockWhere }));
const mockUpdate    = vi.hoisted(() => vi.fn().mockReturnValue({ set: mockSet }));
const mockDelWhere  = vi.hoisted(() => vi.fn().mockResolvedValue([]));
const mockDelete    = vi.hoisted(() => vi.fn().mockReturnValue({ where: mockDelWhere }));

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

// ─── Slug util mock ────────────────────────────────────────────────────────
vi.mock("@/lib/utils/slug", () => ({
  generateSlug: vi.fn().mockReturnValue("test-slug"),
}));

// ─── safeRevalidateTag mock ────────────────────────────────────────────────
vi.mock("@/lib/utils/revalidate", () => ({
  safeRevalidateTag: vi.fn(),
}));

import { revalidateTag } from "next/cache";
import { safeRevalidateTag } from "@/lib/utils/revalidate";
import {
  createPublication,
  updatePublication,
  deletePublication,
} from "@/actions/publications";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/actions/projects";
import { createMember, updateMember, deleteMember } from "@/actions/members";
import { createNews, updateNews, deleteNews } from "@/actions/news";
import { updateContact } from "@/actions/contact";

function makeFormData(entries: Record<string, string> = {}): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
}

function resetDbMocks() {
  mockReturning.mockResolvedValue([{ id: 1 }]);
  mockValues.mockReturnValue({ returning: mockReturning });
  mockInsert.mockReturnValue({ values: mockValues });
  mockWhere.mockResolvedValue([]);
  mockSet.mockReturnValue({ where: mockWhere });
  mockUpdate.mockReturnValue({ set: mockSet });
  mockDelWhere.mockResolvedValue([]);
  mockDelete.mockReturnValue({ where: mockDelWhere });
}

// ══════════════════════════════════════════════════════════════════════════════
// Role Guard — assertRole throws → action rejects, DB never called
// ══════════════════════════════════════════════════════════════════════════════
describe("Professor Server Actions — role guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetDbMocks();
    // Unauthorized: assertRole throws (mirrors redirect() behaviour)
    vi.mocked(permissions.assertRole).mockRejectedValue(
      new Error("NEXT_REDIRECT"),
    );
  });

  describe("publications.ts", () => {
    it("createPublication rejects and does not call DB when unauthorized", async () => {
      await expect(
        createPublication(makeFormData({ title: "Test", year: "2024" })),
      ).rejects.toThrow();
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("updatePublication rejects and does not call DB when unauthorized", async () => {
      await expect(
        updatePublication("1", makeFormData({ title: "Test" })),
      ).rejects.toThrow();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("deletePublication rejects and does not call DB when unauthorized", async () => {
      await expect(deletePublication("1")).rejects.toThrow();
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe("projects.ts", () => {
    it("createProject rejects and does not call DB when unauthorized", async () => {
      await expect(
        createProject(makeFormData({ title: "Test Project" })),
      ).rejects.toThrow();
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("updateProject rejects and does not call DB when unauthorized", async () => {
      await expect(
        updateProject("1", makeFormData({ title: "Test" })),
      ).rejects.toThrow();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("deleteProject rejects and does not call DB when unauthorized", async () => {
      await expect(deleteProject("1")).rejects.toThrow();
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe("members.ts", () => {
    it("createMember rejects and does not call DB when unauthorized", async () => {
      await expect(
        createMember(makeFormData({ nameEn: "Test Member" })),
      ).rejects.toThrow();
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("updateMember rejects and does not call DB when unauthorized", async () => {
      await expect(
        updateMember("1", makeFormData({ nameEn: "Test" })),
      ).rejects.toThrow();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("deleteMember rejects and does not call DB when unauthorized", async () => {
      await expect(deleteMember("1")).rejects.toThrow();
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe("news.ts", () => {
    it("createNews rejects and does not call DB when unauthorized", async () => {
      await expect(
        createNews(makeFormData({ title: "Test News" })),
      ).rejects.toThrow();
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("updateNews rejects and does not call DB when unauthorized", async () => {
      await expect(
        updateNews("1", makeFormData({ title: "Test" })),
      ).rejects.toThrow();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("deleteNews rejects and does not call DB when unauthorized", async () => {
      await expect(deleteNews("1")).rejects.toThrow();
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe("contact.ts", () => {
    it("updateContact rejects and does not call DB when unauthorized", async () => {
      await expect(
        updateContact(makeFormData({ labNameKo: "Test Lab" })),
      ).rejects.toThrow();
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// VIS-02 — revalidateTag cache invalidation on mutation
// ══════════════════════════════════════════════════════════════════════════════
describe("VIS-02 — revalidateTag cache invalidation on mutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetDbMocks();
    // Authorized: assertRole resolves
    vi.mocked(permissions.assertRole).mockResolvedValue(undefined);
  });

  describe("publications cache tag", () => {
    it("createPublication() calls safeRevalidateTag('publications')", async () => {
      await createPublication(
        makeFormData({
          title: "Test",
          year: "2024",
          type: "journal",
          authors: "Author A",
          venue: "ICSE",
        }),
      );
      expect(vi.mocked(safeRevalidateTag)).toHaveBeenCalledWith("publications");
    });

    it("updatePublication() calls safeRevalidateTag('publications')", async () => {
      await updatePublication(
        "1",
        makeFormData({
          title: "Test",
          year: "2024",
          type: "journal",
          authors: "Author A",
          venue: "ICSE",
        }),
      );
      expect(vi.mocked(safeRevalidateTag)).toHaveBeenCalledWith("publications");
    });

    it("deletePublication() calls safeRevalidateTag('publications')", async () => {
      await deletePublication("1");
      expect(vi.mocked(safeRevalidateTag)).toHaveBeenCalledWith("publications");
    });
  });

  describe("projects cache tag", () => {
    it("createProject() calls safeRevalidateTag('projects')", async () => {
      await createProject(
        makeFormData({
          title: "Test Project",
          status: "active",
          category: "research",
          shortDescription: "desc",
          organization: "org",
          startDate: "2024-01-01",
        }),
      );
      expect(vi.mocked(safeRevalidateTag)).toHaveBeenCalledWith("projects");
    });

    it("updateProject() calls safeRevalidateTag('projects')", async () => {
      await updateProject(
        "1",
        makeFormData({
          title: "Test Project",
          status: "active",
          category: "research",
          shortDescription: "desc",
          organization: "org",
          startDate: "2024-01-01",
        }),
      );
      expect(vi.mocked(safeRevalidateTag)).toHaveBeenCalledWith("projects");
    });

    it("deleteProject() calls safeRevalidateTag('projects')", async () => {
      await deleteProject("1");
      expect(vi.mocked(safeRevalidateTag)).toHaveBeenCalledWith("projects");
    });
  });
});
