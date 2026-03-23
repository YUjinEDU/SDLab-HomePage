let cachedUrl: string | undefined;
let cachedAnonKey: string | undefined;

/**
 * Returns the validated Supabase URL from environment variables.
 * Throws a descriptive error if missing or empty.
 * Caches the value after the first call so validation runs once per process.
 */
export function getSupabaseUrl(): string {
  if (cachedUrl !== undefined) return cachedUrl;

  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value || value.trim() === "") {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
        "See .env.example for required variables.",
    );
  }

  cachedUrl = value;
  return cachedUrl;
}

/**
 * Returns the validated Supabase anon key from environment variables.
 * Throws a descriptive error if missing or empty.
 * Caches the value after the first call so validation runs once per process.
 */
export function getSupabaseAnonKey(): string {
  if (cachedAnonKey !== undefined) return cachedAnonKey;

  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value || value.trim() === "") {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. " +
        "See .env.example for required variables.",
    );
  }

  cachedAnonKey = value;
  return cachedAnonKey;
}
