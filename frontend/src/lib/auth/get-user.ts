import { cache } from "react";
import { auth } from "./auth";

export const getAuthUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});
