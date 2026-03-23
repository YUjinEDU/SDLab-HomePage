import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/** 빌드 시점(generateStaticParams, generateMetadata 등)에서 사용하는 클라이언트.
 *  cookies()가 필요 없으므로 빌드 타임에도 안전하게 호출 가능. */
export function createStaticClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey());
}
