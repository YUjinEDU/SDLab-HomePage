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

  // Wire up defaults: most methods return the chain itself
  chain.from.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.neq.mockReturnValue(chain);
  chain.in.mockReturnValue(chain);
  chain.not.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);
  chain.single.mockResolvedValue({ data: {}, error: null });
  // order is the usual terminal — resolves to data
  chain.order.mockReturnValue(
    Object.assign(Promise.resolve({ data: [], error: null }), chain),
  );

  return chain;
});

vi.mock("@/lib/db/supabase-server", () => ({
  createClient: vi.fn().mockResolvedValue(mockChain),
}));

import {
  getPublications,
  getPatents,
  getAllPublications,
  getPublicationBySlug,
  getFeaturedPublications,
} from "@/lib/queries/publications";

describe("VIS-01 — publications query is_public filter", () => {
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

  it("getPublications() must call .eq('is_public', true)", async () => {
    await getPublications().catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getPublications() should filter .eq('is_public', true) but did not",
    ).toBe(true);
  });

  it("getPatents() must call .eq('is_public', true)", async () => {
    await getPatents().catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getPatents() should filter .eq('is_public', true) but did not",
    ).toBe(true);
  });

  it("getAllPublications() must NOT call .eq('is_public', true)", async () => {
    await getAllPublications().catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getAllPublications() is internal — must NOT filter by is_public",
    ).toBe(false);
  });

  it("getPublicationBySlug() must call .eq('is_public', true)", async () => {
    await getPublicationBySlug("some-slug").catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getPublicationBySlug() should filter .eq('is_public', true) but did not",
    ).toBe(true);
  });

  it("getFeaturedPublications() must call .eq('is_public', true)", async () => {
    await getFeaturedPublications().catch(() => {});
    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getFeaturedPublications() should filter .eq('is_public', true) but did not",
    ).toBe(true);
  });
});
