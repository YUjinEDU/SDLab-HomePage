import { revalidateTag as nextRevalidateTag } from "next/cache";

/**
 * Wrapper around Next.js revalidateTag that handles the Next.js 16 type
 * signature (requires 2 args) while working correctly at runtime with 1 arg.
 */
export function safeRevalidateTag(tag: string) {
  try {
    (nextRevalidateTag as (tag: string) => void)(tag);
  } catch {
    /* noop in static context */
  }
}
