import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Drizzle mock ───────────────────────────────────────────────────────────
const mockWhere = vi.hoisted(() => vi.fn().mockResolvedValue([]));
const mockSet   = vi.hoisted(() => vi.fn().mockReturnValue({ where: mockWhere }));
const mockUpdate = vi.hoisted(() => vi.fn().mockReturnValue({ set: mockSet }));

vi.mock("@/lib/db/drizzle", () => ({
  db: { update: mockUpdate },
}));

// ─── Permissions mock ──────────────────────────────────────────────────────
vi.mock("@/lib/permissions", () => ({
  requireRole: vi.fn().mockResolvedValue(undefined),
}));

// ─── next/cache mock ───────────────────────────────────────────────────────
vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

import {
  togglePublicationVisibility,
  toggleProjectVisibility,
} from "@/actions/visibility";
import { requireRole } from "@/lib/permissions";

describe("VIS-03 — visibility Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(undefined);
    mockUpdate.mockReturnValue({ set: mockSet });
    mockSet.mockReturnValue({ where: mockWhere });
    mockWhere.mockResolvedValue([]);
  });

  // ─── togglePublicationVisibility ─────────────────────────────────────────
  describe("togglePublicationVisibility", () => {
    it("returns { success: true } when update succeeds with isPublic: true", async () => {
      const result = await togglePublicationVisibility("123", true);
      expect(result).toEqual({ success: true });
    });

    it("returns { success: true } when update succeeds with isPublic: false", async () => {
      const result = await togglePublicationVisibility("456", false);
      expect(result).toEqual({ success: true });
    });

    it("calls db.update on publications table", async () => {
      await togglePublicationVisibility("123", true);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledWith({ isPublic: true });
    });

    it("calls safeRevalidateTag('publications') on success", async () => {
      // safeRevalidateTag wraps revalidateTag from next/cache
      const { revalidateTag } = await import("next/cache");
      await togglePublicationVisibility("123", true);
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith("publications");
    });

    it("returns { error: 'Unauthorized' } when requireRole throws", async () => {
      vi.mocked(requireRole).mockRejectedValue(new Error("unauthorized"));
      const result = await togglePublicationVisibility("123", true);
      expect(result).toEqual({ error: "Unauthorized" });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns { error: 'Invalid publication ID' } for non-numeric ID", async () => {
      const result = await togglePublicationVisibility("pub-abc", true);
      expect(result).toEqual({ error: "Invalid publication ID" });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns { error: message } and skips revalidate when DB throws", async () => {
      mockWhere.mockRejectedValueOnce(new Error("DB connection error"));
      const { revalidateTag } = await import("next/cache");
      const result = await togglePublicationVisibility("123", true);
      expect(result).toEqual({ error: "DB connection error" });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });
  });

  // ─── toggleProjectVisibility ─────────────────────────────────────────────
  describe("toggleProjectVisibility", () => {
    it("returns { success: true } when update succeeds with isPublic: true", async () => {
      const result = await toggleProjectVisibility("123", true);
      expect(result).toEqual({ success: true });
    });

    it("calls db.update on projects table", async () => {
      await toggleProjectVisibility("123", true);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledWith({ isPublic: true });
    });

    it("calls safeRevalidateTag('projects') on success", async () => {
      const { revalidateTag } = await import("next/cache");
      await toggleProjectVisibility("123", true);
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith("projects");
    });

    it("returns { error: 'Unauthorized' } when requireRole throws", async () => {
      vi.mocked(requireRole).mockRejectedValue(new Error("unauthorized"));
      const result = await toggleProjectVisibility("123", true);
      expect(result).toEqual({ error: "Unauthorized" });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns { error: 'Invalid project ID' } for non-numeric ID", async () => {
      const result = await toggleProjectVisibility("proj-abc", true);
      expect(result).toEqual({ error: "Invalid project ID" });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns { error: message } and skips revalidate when DB throws", async () => {
      mockWhere.mockRejectedValueOnce(new Error("project DB error"));
      const { revalidateTag } = await import("next/cache");
      const result = await toggleProjectVisibility("123", true);
      expect(result).toEqual({ error: "project DB error" });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });
  });
});
