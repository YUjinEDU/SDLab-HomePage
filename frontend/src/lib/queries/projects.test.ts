import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted so mockChain is available when vi.mock factory runs
const mockChain = vi.hoisted(() => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    from: vi.fn(),
    select: vi.fn(),
    eq: vi.fn(),
    neq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    single: vi.fn(),
    in: vi.fn(),
    not: vi.fn(),
  };

  chain.from.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.neq.mockReturnValue(chain);
  chain.in.mockReturnValue(chain);
  chain.not.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);
  chain.single.mockResolvedValue({ data: {}, error: null });
  chain.order.mockReturnValue(
    Object.assign(Promise.resolve({ data: [], error: null }), chain),
  );

  return chain;
});

vi.mock("@/lib/db/supabase-server", () => ({
  createClient: vi.fn().mockResolvedValue(mockChain),
}));

import {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
} from "@/lib/queries/projects";

describe("VIS-01 — projects query is_public filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-wire chain after clearAllMocks resets all spies
    mockChain.from.mockReturnValue(mockChain);
    mockChain.select.mockReturnValue(mockChain);
    mockChain.eq.mockReturnValue(mockChain);
    mockChain.neq.mockReturnValue(mockChain);
    mockChain.in.mockReturnValue(mockChain);
    mockChain.not.mockReturnValue(mockChain);
    mockChain.limit.mockReturnValue(mockChain);
    mockChain.single.mockResolvedValue({ data: {}, error: null });
    mockChain.order.mockReturnValue(
      Object.assign(Promise.resolve({ data: [], error: null }), mockChain),
    );
  });

  it("getProjects() must call .eq('is_public', true)", async () => {
    await getProjects().catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getProjects() should filter .eq('is_public', true) but did not",
    ).toBe(true);
  });

  it("getFeaturedProjects() must call .eq('is_public', true)", async () => {
    await getFeaturedProjects().catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getFeaturedProjects() should filter .eq('is_public', true) but did not",
    ).toBe(true);
  });

  it("getProjectBySlug() must call .eq('is_public', true)", async () => {
    await getProjectBySlug("some-slug").catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getProjectBySlug() should filter .eq('is_public', true) but did not",
    ).toBe(true);
  });

  it("getProjectById() must NOT call .eq('is_public', true)", async () => {
    await getProjectById("some-id").catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getProjectById() is internal — must NOT filter by is_public",
    ).toBe(false);
  });
});
