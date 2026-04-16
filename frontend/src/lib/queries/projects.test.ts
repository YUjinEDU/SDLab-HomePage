import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock @/lib/db/drizzle — intercept all db.select() chains
// ---------------------------------------------------------------------------
const mockQuery = vi.hoisted(() => {
  const q: Record<string, ReturnType<typeof vi.fn>> = {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  };
  // Default: every chained method returns q itself; terminal awaits resolve []
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

// Also mock next/cache so unstable_cache just calls through
vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) =>
    (...args: unknown[]) =>
      fn(...args),
}));

import {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
} from "@/lib/queries/projects";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeProjectRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    slug: "proj-1",
    title: "Test Project",
    status: "active",
    category: "Research",
    shortDescription: "Short desc",
    fullDescription: null,
    organization: "Org",
    programType: null,
    budget: null,
    startDate: null,
    endDate: null,
    thumbnail: null,
    tags: [],
    demoUrl: null,
    isFeatured: false,
    isPublic: true,
    ...overrides,
  };
}

// Drizzle enrichProject makes 3 parallel sub-queries (projectMembers,
// projectResearchAreas, publicationProjects). We need select() to handle
// the join sub-queries after the main rows are returned.
// Strategy: first select() call returns main rows; subsequent calls return [].
function setupMainQuery(rows: ReturnType<typeof makeProjectRow>[]) {
  let callCount = 0;
  mockQuery.select.mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      // orderBy may be followed by .limit() (getFeaturedProjects)
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
    // Subsequent calls are join sub-queries — return empty arrays
    const emptyChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };
    emptyChain.from.mockReturnValue(emptyChain);
    return emptyChain;
  });
}

// ---------------------------------------------------------------------------
// VIS-01 — projects query is_public filter
// ---------------------------------------------------------------------------
describe("VIS-01 — projects query is_public filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no rows
    mockQuery.select.mockReturnValue(mockQuery);
    mockQuery.from.mockReturnValue(mockQuery);
    mockQuery.where.mockReturnValue(mockQuery);
    mockQuery.orderBy.mockReturnValue(Object.assign(Promise.resolve([]), mockQuery));
    mockQuery.limit.mockReturnValue(Promise.resolve([]));
  });

  it("getProjects() returns only public projects", async () => {
    const publicRow = makeProjectRow({ isPublic: true });
    setupMainQuery([publicRow]);
    const result = await getProjects();
    expect(result).toHaveLength(1);
    expect(result[0].isPublic).toBe(true);
  });

  it("getProjects() returns [] when no public projects exist", async () => {
    setupMainQuery([]);
    const result = await getProjects();
    expect(result).toEqual([]);
  });

  it("getFeaturedProjects() returns only public featured projects", async () => {
    const featuredRow = makeProjectRow({ isPublic: true, isFeatured: true });
    setupMainQuery([featuredRow]);
    const result = await getFeaturedProjects();
    expect(result).toHaveLength(1);
    expect(result[0].isFeatured).toBe(true);
    expect(result[0].isPublic).toBe(true);
  });

  it("getFeaturedProjects() returns [] when no featured public projects", async () => {
    setupMainQuery([]);
    const result = await getFeaturedProjects();
    expect(result).toEqual([]);
  });

  it("getProjectBySlug() returns matching public project", async () => {
    const row = makeProjectRow({ slug: "some-slug", isPublic: true });
    setupMainQuery([row]);
    const result = await getProjectBySlug("some-slug");
    expect(result).not.toBeNull();
    expect(result?.slug).toBe("some-slug");
    expect(result?.isPublic).toBe(true);
  });

  it("getProjectBySlug() returns null when project not found", async () => {
    setupMainQuery([]);
    const result = await getProjectBySlug("missing-slug");
    expect(result).toBeNull();
  });

  it("getProjectById() returns project regardless of isPublic (internal access)", async () => {
    const privateRow = makeProjectRow({ id: 99, slug: "private-proj", isPublic: false });
    setupMainQuery([privateRow]);
    const result = await getProjectById("99");
    // Internal query: no is_public filter — returns the row as-is
    expect(result).not.toBeNull();
    expect(result?.id).toBe("99");
  });

  it("getProjectById() returns null when not found", async () => {
    setupMainQuery([]);
    const result = await getProjectById("999");
    expect(result).toBeNull();
  });
});
