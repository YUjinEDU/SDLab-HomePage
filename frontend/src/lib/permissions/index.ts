import { createClient } from "@/lib/db/supabase-server";
import { getAuthUser } from "@/lib/auth/get-user";

export type Role = "member" | "professor" | "admin";

const ROLE_HIERARCHY: Record<Role, number> = {
  member: 0,
  professor: 1,
  admin: 2,
};

/**
 * Checks if the current authenticated user has at least `minRole`.
 * Returns null on success, { error: 'unauthorized' } on failure.
 */
export async function assertRole(
  minRole: Role,
): Promise<{ error: "unauthorized" } | null> {
  const supabase = await createClient();
  const user = await getAuthUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return { error: "unauthorized" };
  }

  const userRank = ROLE_HIERARCHY[profile.role as Role] ?? -1;
  const minRank = ROLE_HIERARCHY[minRole];

  if (userRank < minRank) {
    return { error: "unauthorized" };
  }

  return null;
}

/**
 * Asserts the current user has at least `minRole`.
 * Throws Error('unauthorized') if the check fails.
 * Use inside Server Actions; caller handles redirect/AccessDenied.
 */
export async function requireRole(minRole: Role): Promise<void> {
  const result = await assertRole(minRole);
  if (result !== null) {
    throw new Error("unauthorized");
  }
}

/**
 * getUser() + role check in a single Supabase round-trip pair.
 * Use in layouts that need both the user object and role enforcement,
 * avoiding the double getUser() from calling getSession() + requireRole() separately.
 *
 * Returns { user, error: null } on success, { user: null, error: "unauthorized" } on failure.
 */
export async function getSessionWithRole(
  minRole: Role,
): Promise<
  | { user: import("@supabase/supabase-js").User; error: null }
  | { user: null; error: "unauthorized" }
> {
  const supabase = await createClient();
  const user = await getAuthUser();

  if (!user) return { user: null, error: "unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) return { user: null, error: "unauthorized" };

  const userRank = ROLE_HIERARCHY[profile.role as Role] ?? -1;
  if (userRank < ROLE_HIERARCHY[minRole])
    return { user: null, error: "unauthorized" };

  return { user, error: null };
}
