import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the supabase server client
vi.mock("@/lib/db/supabase-server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/db/supabase-server";
import { assertRole, requireRole } from "@/lib/permissions";

const mockCreateClient = vi.mocked(createClient);

function makeClient(userId: string | null, role: string | null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userId ? { id: userId } : null },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: role ? { role } : null,
            error: role ? null : { message: "not found" },
          }),
        }),
      }),
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("assertRole", () => {
  it("returns { error: unauthorized } when user has member role and professor is required", async () => {
    mockCreateClient.mockResolvedValue(makeClient("user-1", "member") as any);
    const result = await assertRole("professor");
    expect(result).toEqual({ error: "unauthorized" });
  });

  it("returns null when user has professor role and professor is required", async () => {
    mockCreateClient.mockResolvedValue(
      makeClient("user-1", "professor") as any,
    );
    const result = await assertRole("professor");
    expect(result).toBeNull();
  });

  it("returns null when user has admin role and professor is required (admin >= professor)", async () => {
    mockCreateClient.mockResolvedValue(makeClient("user-1", "admin") as any);
    const result = await assertRole("professor");
    expect(result).toBeNull();
  });

  it("returns { error: unauthorized } when user has professor role and admin is required", async () => {
    mockCreateClient.mockResolvedValue(
      makeClient("user-1", "professor") as any,
    );
    const result = await assertRole("admin");
    expect(result).toEqual({ error: "unauthorized" });
  });

  it("returns { error: unauthorized } when no authenticated user", async () => {
    mockCreateClient.mockResolvedValue(makeClient(null, null) as any);
    const result = await assertRole("professor");
    expect(result).toEqual({ error: "unauthorized" });
  });
});

describe("requireRole", () => {
  it('throws Error("unauthorized") when user has member role and professor is required', async () => {
    mockCreateClient.mockResolvedValue(makeClient("user-1", "member") as any);
    await expect(requireRole("professor")).rejects.toThrow("unauthorized");
  });

  it("resolves without throwing when user has professor role and professor is required", async () => {
    mockCreateClient.mockResolvedValue(
      makeClient("user-1", "professor") as any,
    );
    await expect(requireRole("professor")).resolves.toBeUndefined();
  });
});
