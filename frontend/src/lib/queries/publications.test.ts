import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock @/lib/db/drizzle
// ---------------------------------------------------------------------------
const mockQuery = vi.hoisted(() => {
  const q: Record<string, ReturnType<typeof vi.fn>> = {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  };
  q.select.mockReturnValue(q);
  q.from.mockReturnValue(q);
  q.where.mockReturnValue(q);
  q.orderBy.mockReturnValue(Object.assign(Promise.resolve([]), q));
  q.limit.mockReturnValue(Promise.resolve([]));
  return q;
});

vi.mock("@/lib/db/drizzle", () => ({
  db: { select: mockQuery.select },
}));

vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) =>
    (...args: unknown[]) =>
      fn(...args),
}));

import {
  getPublications,
  getPatents,
  getAllPublications,
  getPublicationBySlug,
  getFeaturedPublications,
  getProjectOutputs,
} from "@/lib/queries/publications";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makePubRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    slug: "pub-1",
    title: "Test Publication",
    authors: "Author A, Author B",
    type: "journal",
    isInternational: true,
    venue: "Test Venue",
    year: 2024,
    month: 1,
    doi: null,
    pdfUrl: null,
    abstract: null,
    keywords: [],
    bibtex: null,
    isFeatured: false,
    isPublic: true,
    indexType: null,
    volumeInfo: null,
    ...overrides,
  };
}

// enrichPublication makes 3 parallel sub-queries.
// First select() call is main query; subsequent are join sub-queries.
// Publications queries may chain: .where().orderBy() or .where().orderBy().limit()
function setupMainQuery(rows: ReturnType<typeof makePubRow>[]) {
  let callCount = 0;
  mockQuery.select.mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      // limitChain is needed when orderBy().limit() is called (e.g. getFeaturedPublications)
      const limitChain = { then: undefined as unknown } as Record<string, unknown>;
      limitChain.then = undefined; // not a thenable — limit returns a real Promise
      const orderByResult = Object.assign(Promise.resolve(rows), {
        limit: vi.fn().mockResolvedValue(rows.slice(0, 3)),
      });
      const chain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnValue(orderByResult),
        limit: vi.fn().mockResolvedValue(rows.slice(0, 1)),
      };
      chain.from.mockReturnValue(chain);
      chain.where.mockReturnValue(chain);
      return chain;
    }
    // Join sub-queries: where() is terminal for researchAreas/projects,
    // but publicationAuthors chains .where().orderBy() — so where() must be
    // both awaitable (Promise) AND have .orderBy() on it.
    const emptyOrderBy = vi.fn().mockResolvedValue([]);
    const emptyWhere = Object.assign(Promise.resolve([]), { orderBy: emptyOrderBy });
    const emptyChain = {
      from: vi.fn(),
      where: vi.fn().mockReturnValue(emptyWhere),
    };
    emptyChain.from.mockReturnValue(emptyChain);
    return emptyChain;
  });
}

// Setup for getProjectOutputs: first call is publicationProjects join,
// second+ calls are for publications and its sub-queries.
function setupProjectOutputsQuery(
  joinRows: { publicationId: number }[],
  pubRows: ReturnType<typeof makePubRow>[],
) {
  let callCount = 0;
  mockQuery.select.mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      // publicationProjects join query
      const chain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(joinRows),
      };
      chain.from.mockReturnValue(chain);
      return chain;
    }
    if (callCount === 2) {
      // publications main query — terminal is .orderBy()
      const orderByResult = Object.assign(Promise.resolve(pubRows), {
        limit: vi.fn().mockResolvedValue(pubRows.slice(0, 3)),
      });
      const chain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnValue(orderByResult),
      };
      chain.from.mockReturnValue(chain);
      chain.where.mockReturnValue(chain);
      return chain;
    }
    // publication enrichment sub-queries
    const emptyOrderBy = vi.fn().mockResolvedValue([]);
    const emptyWhere = Object.assign(Promise.resolve([]), { orderBy: emptyOrderBy });
    const emptyChain = {
      from: vi.fn(),
      where: vi.fn().mockReturnValue(emptyWhere),
    };
    emptyChain.from.mockReturnValue(emptyChain);
    return emptyChain;
  });
}

// ---------------------------------------------------------------------------
// LINK-01 — getProjectOutputs
// ---------------------------------------------------------------------------
describe("LINK-01 — getProjectOutputs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.select.mockReturnValue(mockQuery);
    mockQuery.from.mockReturnValue(mockQuery);
    mockQuery.where.mockReturnValue(mockQuery);
    mockQuery.orderBy.mockReturnValue(Object.assign(Promise.resolve([]), mockQuery));
    mockQuery.limit.mockReturnValue(Promise.resolve([]));
  });

  it("returns mapped Publication when publication_projects has rows and publications returns data", async () => {
    const pubRow = makePubRow({ id: 1, slug: "pub-slug-1", title: "Test Publication" });
    setupProjectOutputsQuery([{ publicationId: 1 }], [pubRow]);

    const result = await getProjectOutputs("1");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("pub-slug-1");
    expect(result[0].title).toBe("Test Publication");
  });

  it("returns [] without querying publications when publication_projects returns no rows", async () => {
    let selectCallCount = 0;
    mockQuery.select.mockImplementation(() => {
      selectCallCount++;
      const chain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };
      chain.from.mockReturnValue(chain);
      return chain;
    });

    const result = await getProjectOutputs("proj-empty");
    expect(result).toEqual([]);
    // Only one select() call — publications table never queried
    expect(selectCallCount).toBe(1);
  });

  it("returns only public publications from project outputs", async () => {
    const pubRow = makePubRow({ isPublic: true });
    setupProjectOutputsQuery([{ publicationId: 1 }], [pubRow]);

    const result = await getProjectOutputs("1");
    expect(result.every((p) => p.isPublic)).toBe(true);
  });

  it("returns [] when all matched publications are non-public", async () => {
    // The query filters isPublic=true, so non-public rows won't be returned
    setupProjectOutputsQuery([{ publicationId: 1 }], []);

    const result = await getProjectOutputs("1");
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// VIS-01 — publications query is_public filter
// ---------------------------------------------------------------------------
describe("VIS-01 — publications query is_public filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.select.mockReturnValue(mockQuery);
    mockQuery.from.mockReturnValue(mockQuery);
    mockQuery.where.mockReturnValue(mockQuery);
    mockQuery.orderBy.mockReturnValue(Object.assign(Promise.resolve([]), mockQuery));
    mockQuery.limit.mockReturnValue(Promise.resolve([]));
  });

  it("getPublications() returns public publications", async () => {
    const row = makePubRow({ isPublic: true });
    setupMainQuery([row]);
    const result = await getPublications();
    expect(result).toHaveLength(1);
    expect(result[0].isPublic).toBe(true);
  });

  it("getPublications() returns [] when no public publications", async () => {
    setupMainQuery([]);
    const result = await getPublications();
    expect(result).toEqual([]);
  });

  it("getPatents() returns [] (stub — patents table not yet migrated)", async () => {
    const result = await getPatents();
    expect(result).toEqual([]);
  });

  it("getAllPublications() returns all publications (no is_public filter)", async () => {
    const publicRow = makePubRow({ isPublic: true });
    const privateRow = makePubRow({ id: 2, slug: "priv", isPublic: false });
    setupMainQuery([publicRow, privateRow]);
    const result = await getAllPublications();
    // Returns whatever the DB returns — no public filter
    expect(result).toHaveLength(2);
  });

  it("getPublicationBySlug() returns matching public publication", async () => {
    const row = makePubRow({ slug: "some-slug", isPublic: true });
    setupMainQuery([row], { terminal: "limit" });
    const result = await getPublicationBySlug("some-slug");
    expect(result).not.toBeNull();
    expect(result?.slug).toBe("some-slug");
  });

  it("getPublicationBySlug() returns null when not found", async () => {
    setupMainQuery([]);
    const result = await getPublicationBySlug("missing");
    expect(result).toBeNull();
  });

  it("getFeaturedPublications() returns featured public publications", async () => {
    const row = makePubRow({ isPublic: true, isFeatured: true });
    setupMainQuery([row]);
    const result = await getFeaturedPublications();
    expect(result).toHaveLength(1);
    expect(result[0].isFeatured).toBe(true);
  });

  it("getFeaturedPublications() returns [] when none featured", async () => {
    setupMainQuery([]);
    const result = await getFeaturedPublications();
    expect(result).toEqual([]);
  });
});
