// Vitest mock for next/cache — makes unstable_cache a pass-through
// so query functions execute normally in unit tests.
export const unstable_cache = <
  T extends (...args: unknown[]) => Promise<unknown>,
>(
  fn: T,
  _keyParts?: string[],
  _options?: { tags?: string[] },
): T => fn;

export const revalidateTag = () => {};
export const revalidatePath = () => {};
