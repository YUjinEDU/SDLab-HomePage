import { describe, it, expect, vi, beforeEach } from "vitest";
import * as permissions from "@/lib/permissions";

// Mock lib/permissions so assertRole always returns { error: 'unauthorized' }
vi.mock("@/lib/permissions", () => ({
  assertRole: vi.fn().mockResolvedValue({ error: "unauthorized" }),
}));

// Mock next/cache to avoid server-only errors in test environment
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock Supabase server client — should not be reached when guard fires first
vi.mock("@/lib/db/supabase-server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ error: null }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
  }),
}));

// Mock slug util
vi.mock("@/lib/utils/slug", () => ({
  generateSlug: vi.fn().mockReturnValue("test-slug"),
}));

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

describe("Professor Server Actions — role guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to always return unauthorized
    vi.mocked(permissions.assertRole).mockResolvedValue({
      error: "unauthorized",
    });
  });

  describe("publications.ts", () => {
    it("createPublication returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await createPublication(
        makeFormData({ title: "Test", year: "2024" }),
      );
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("updatePublication returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await updatePublication(
        "some-id",
        makeFormData({ title: "Test" }),
      );
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("deletePublication returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await deletePublication("some-id");
      expect(result).toEqual({ error: "unauthorized" });
    });
  });

  describe("projects.ts", () => {
    it("createProject returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await createProject(
        makeFormData({ title: "Test Project" }),
      );
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("updateProject returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await updateProject(
        "some-id",
        makeFormData({ title: "Test" }),
      );
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("deleteProject returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await deleteProject("some-id");
      expect(result).toEqual({ error: "unauthorized" });
    });
  });

  describe("members.ts", () => {
    it("createMember returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await createMember(
        makeFormData({ nameEn: "Test Member" }),
      );
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("updateMember returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await updateMember(
        "some-id",
        makeFormData({ nameEn: "Test" }),
      );
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("deleteMember returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await deleteMember("some-id");
      expect(result).toEqual({ error: "unauthorized" });
    });
  });

  describe("news.ts", () => {
    it("createNews returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await createNews(makeFormData({ title: "Test News" }));
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("updateNews returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await updateNews(
        "some-id",
        makeFormData({ title: "Test" }),
      );
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("deleteNews returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await deleteNews("some-id");
      expect(result).toEqual({ error: "unauthorized" });
    });
  });

  describe("contact.ts", () => {
    it("updateContact returns { error: 'unauthorized' } when assertRole fails", async () => {
      const result = await updateContact(
        makeFormData({ labNameKo: "Test Lab" }),
      );
      expect(result).toEqual({ error: "unauthorized" });
    });
  });
});
