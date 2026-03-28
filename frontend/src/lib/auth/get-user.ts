import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/db/supabase-server";

/**
 * React cache()로 래핑된 getUser.
 * 동일 요청 내에서 layout + page + permissions 등 여러 곳에서 호출해도
 * Supabase 네트워크 콜은 1번만 발생.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
