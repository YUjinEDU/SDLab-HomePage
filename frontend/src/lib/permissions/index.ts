import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export type Role = "member" | "professor" | "admin";

const ROLE_HIERARCHY: Record<Role, number> = {
  member: 1,
  professor: 2,
  admin: 3,
};

/**
 * Asserts the current user has at least `minRole`.
 * Redirects to "/" if unauthorized.
 */
export async function assertRole(required: Role): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = session.user.role as Role;
  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[required]) {
    redirect("/");
  }
}

/**
 * Returns the current user from Auth.js session, or null if not authenticated.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Checks if a given user role meets the required role level.
 */
export function hasRole(userRole: Role, required: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required];
}

/**
 * requireRole() for Server Actions — throws Error if role check fails.
 * Caller handles error handling / redirect.
 */
export async function requireRole(minRole: Role): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("unauthorized");
  }

  const userRole = session.user.role as Role;
  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minRole]) {
    throw new Error("unauthorized");
  }
}
