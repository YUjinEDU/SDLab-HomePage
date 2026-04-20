import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Auth.js v5 auth() — controls what session is returned
vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

// Mock next/navigation redirect — makes it throw so we can assert it was called
vi.mock("next/navigation", () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), {
      digest: `NEXT_REDIRECT;replace;${url};303;`,
    });
  }),
}));

import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { assertRole, requireRole } from "@/lib/permissions";

const mockAuth = vi.mocked(auth);
const mockRedirect = vi.mocked(redirect);

function makeSession(role: string | null) {
  if (!role) return null;
  return {
    user: { id: "user-1", email: "test@test.com", role, memberId: null },
    expires: "2099-01-01",
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Re-apply throw behaviour after clearAllMocks resets implementations
  mockRedirect.mockImplementation((url: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), {
      digest: `NEXT_REDIRECT;replace;${url};303;`,
    });
  });
});

// ─── assertRole ────────────────────────────────────────────────────────────
describe("assertRole", () => {
  it("redirects to '/' when member role is present and professor is required", async () => {
    mockAuth.mockResolvedValue(makeSession("member") as never);
    await expect(assertRole("professor")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("resolves without throwing when professor role meets professor requirement", async () => {
    mockAuth.mockResolvedValue(makeSession("professor") as never);
    await expect(assertRole("professor")).resolves.toBeUndefined();
  });

  it("resolves without throwing when admin role meets professor requirement (admin >= professor)", async () => {
    mockAuth.mockResolvedValue(makeSession("admin") as never);
    await expect(assertRole("professor")).resolves.toBeUndefined();
  });

  it("redirects to '/' when professor role is present but admin is required", async () => {
    mockAuth.mockResolvedValue(makeSession("professor") as never);
    await expect(assertRole("admin")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("redirects to '/login' when no authenticated user", async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(assertRole("professor")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
});

// ─── requireRole ───────────────────────────────────────────────────────────
describe("requireRole", () => {
  it('throws Error("unauthorized") when member role is present and professor is required', async () => {
    mockAuth.mockResolvedValue(makeSession("member") as never);
    await expect(requireRole("professor")).rejects.toThrow("unauthorized");
  });

  it("resolves without throwing when professor role meets professor requirement", async () => {
    mockAuth.mockResolvedValue(makeSession("professor") as never);
    await expect(requireRole("professor")).resolves.toBeUndefined();
  });

  it('throws Error("unauthorized") when no authenticated user', async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(requireRole("professor")).rejects.toThrow("unauthorized");
  });

  it("resolves without throwing when admin role meets professor requirement", async () => {
    mockAuth.mockResolvedValue(makeSession("admin") as never);
    await expect(requireRole("professor")).resolves.toBeUndefined();
  });

  it('throws Error("unauthorized") when member role is present and admin is required', async () => {
    mockAuth.mockResolvedValue(makeSession("member") as never);
    await expect(requireRole("admin")).rejects.toThrow("unauthorized");
  });
});
