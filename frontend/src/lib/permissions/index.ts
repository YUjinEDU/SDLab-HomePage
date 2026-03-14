import { createClient } from "@/lib/db/supabase-server";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
