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
  getProjectOutputs,
} from "@/lib/queries/publications";

describe("LINK-01 — getProjectOutputs", () => {
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

  it("returns mapped Publication when publication_projects has rows and publications returns data", async () => {
    // First call: publication_projects join — eq('project_id', ...) → returns join rows
    // Second call: publications query — order() resolves with data
    mockChain.eq
      .mockReturnValueOnce(
        Object.assign(
          Promise.resolve({ data: [{ publication_id: "pub-1" }], error: null }),
          mockChain,
        ),
      )
      .mockReturnValue(mockChain);

    mockChain.order.mockReturnValue(
      Object.assign(
        Promise.resolve({
          data: [
            {
              id: "pub-1",
              slug: "pub-slug-1",
              title: "Test Publication",
              authors: ["Author A"],
              type: "journal",
              is_international: true,
              venue: "Test Venue",
              year: 2024,
              month: 1,
              doi: null,
              pdf_url: null,
              abstract: null,
              keywords: [],
              bibtex: null,
              is_featured: false,
              publication_authors: [],
              publication_research_areas: [],
              publication_projects: [],
            },
          ],
          error: null,
        }),
        mockChain,
      ),
    );

    const result = await getProjectOutputs("proj-1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("pub-1");
    expect(result[0].title).toBe("Test Publication");
  });

  it("returns [] without querying publications when publication_projects returns no rows", async () => {
    mockChain.eq.mockReturnValue(
      Object.assign(Promise.resolve({ data: [], error: null }), mockChain),
    );

    const result = await getProjectOutputs("proj-empty");
    expect(result).toEqual([]);
    // publications table should not have been queried — from called only once (publication_projects)
    const fromCalls = mockChain.from.mock.calls.map(
      ([table]: [string]) => table,
    );
    expect(fromCalls).not.toContain("publications");
  });

  it("calls .eq('is_public', true) on publications query", async () => {
    // First eq call resolves join rows
    mockChain.eq
      .mockReturnValueOnce(
        Object.assign(
          Promise.resolve({ data: [{ publication_id: "pub-1" }], error: null }),
          mockChain,
        ),
      )
      .mockReturnValue(mockChain);

    await getProjectOutputs("proj-1").catch(() => {});

    const hasIsPublicFilter = mockChain.eq.mock.calls.some(
      ([col, val]: [string, unknown]) => col === "is_public" && val === true,
    );
    expect(
      hasIsPublicFilter,
      "getProjectOutputs should filter .eq('is_public', true)",
    ).toBe(true);
  });

  it("calls .in('id', ['pub-1']) with ids from join rows", async () => {
    mockChain.eq
      .mockReturnValueOnce(
        Object.assign(
          Promise.resolve({ data: [{ publication_id: "pub-1" }], error: null }),
          mockChain,
        ),
      )
      .mockReturnValue(mockChain);

    await getProjectOutputs("proj-1").catch(() => {});

    const inCall = mockChain.in.mock.calls.find(
      ([col, ids]: [string, string[]]) => col === "id" && ids.includes("pub-1"),
    );
    expect(
      inCall,
      "getProjectOutputs should call .in('id', ['pub-1'])",
    ).toBeTruthy();
  });

  it("throws when publications query returns an error", async () => {
    mockChain.eq
      .mockReturnValueOnce(
        Object.assign(
          Promise.resolve({ data: [{ publication_id: "pub-1" }], error: null }),
          mockChain,
        ),
      )
      .mockReturnValue(mockChain);

    mockChain.order.mockReturnValue(
      Object.assign(
        Promise.resolve({ data: null, error: new Error("DB error") }),
        mockChain,
      ),
    );

    await expect(getProjectOutputs("proj-1")).rejects.toThrow("DB error");
  });
});

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
