import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted so mockChain is available when vi.mock factory runs
const mockChain = vi.hoisted(() => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    from: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    eq: vi.fn(),
  };

  chain.from.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.update.mockReturnValue(chain);
  chain.eq.mockResolvedValue({ data: null, error: null });

  return chain;
});

vi.mock("@/lib/db/supabase-server", () => ({
  createClient: vi.fn().mockResolvedValue(mockChain),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/lib/permissions", () => ({
  assertRole: vi.fn().mockResolvedValue(null),
}));

import {
  togglePublicationVisibility,
  toggleProjectVisibility,
} from "@/actions/visibility";
import { revalidateTag } from "next/cache";
import { assertRole } from "@/lib/permissions";

describe("VIS-03 — visibility Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire chain after clearAllMocks
    mockChain.from.mockReturnValue(mockChain);
    mockChain.select.mockReturnValue(mockChain);
    mockChain.update.mockReturnValue(mockChain);
    mockChain.eq.mockResolvedValue({ data: null, error: null });

    // Default: authorized
    vi.mocked(assertRole).mockResolvedValue(null);
  });

  describe("togglePublicationVisibility", () => {
    it("calls supabase update with is_public: true on publications table", async () => {
      const result = await togglePublicationVisibility("pub-123", true);

      expect(mockChain.from).toHaveBeenCalledWith("publications");
      expect(mockChain.update).toHaveBeenCalledWith({ is_public: true });
      expect(mockChain.eq).toHaveBeenCalledWith("id", "pub-123");
      expect(result).toEqual({ success: true });
    });

    it("calls supabase update with is_public: false on publications table", async () => {
      const result = await togglePublicationVisibility("pub-456", false);

      expect(mockChain.from).toHaveBeenCalledWith("publications");
      expect(mockChain.update).toHaveBeenCalledWith({ is_public: false });
      expect(mockChain.eq).toHaveBeenCalledWith("id", "pub-456");
      expect(result).toEqual({ success: true });
    });

    it("calls revalidateTag('publications') on success", async () => {
      await togglePublicationVisibility("pub-123", true);
      expect(revalidateTag).toHaveBeenCalledWith("publications");
    });

    it("returns error without touching DB when assertRole returns error", async () => {
      vi.mocked(assertRole).mockResolvedValue({ error: "unauthorized" });

      const result = await togglePublicationVisibility("pub-123", true);

      expect(mockChain.from).not.toHaveBeenCalled();
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("returns {error: message} when DB update fails", async () => {
      mockChain.eq.mockResolvedValue({
        data: null,
        error: { message: "DB error" },
      });

      const result = await togglePublicationVisibility("pub-123", true);

      expect(result).toEqual({ error: "DB error" });
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });

  describe("toggleProjectVisibility", () => {
    it("calls supabase update with is_public: true on projects table", async () => {
      const result = await toggleProjectVisibility("proj-123", true);

      expect(mockChain.from).toHaveBeenCalledWith("projects");
      expect(mockChain.update).toHaveBeenCalledWith({ is_public: true });
      expect(mockChain.eq).toHaveBeenCalledWith("id", "proj-123");
      expect(result).toEqual({ success: true });
    });

    it("calls revalidateTag('projects') on success", async () => {
      await toggleProjectVisibility("proj-123", true);
      expect(revalidateTag).toHaveBeenCalledWith("projects");
    });

    it("returns error without touching DB when assertRole returns error", async () => {
      vi.mocked(assertRole).mockResolvedValue({ error: "unauthorized" });

      const result = await toggleProjectVisibility("proj-123", true);

      expect(mockChain.from).not.toHaveBeenCalled();
      expect(result).toEqual({ error: "unauthorized" });
    });

    it("returns {error: message} when DB update fails", async () => {
      mockChain.eq.mockResolvedValue({
        data: null,
        error: { message: "project DB error" },
      });

      const result = await toggleProjectVisibility("proj-123", true);

      expect(result).toEqual({ error: "project DB error" });
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
