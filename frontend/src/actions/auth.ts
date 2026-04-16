"use server";

import { signIn, signOut, auth } from "@/lib/auth/auth";
import { AuthError } from "next-auth";
import type { ActionResult } from "@/types";

export async function login(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/internal";

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    }
    throw error;
  }
  return { success: true };
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

export async function getSession() {
  const session = await auth();
  return session;
}
