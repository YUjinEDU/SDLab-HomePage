"use server";

import { createClient } from "@/lib/db/supabase-server";
import { getAuthUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types/action";

function requireString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

export async function login(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  let email: string;
  let password: string;
  try {
    email = requireString(formData, "email");
    password = requireString(formData, "password");
  } catch {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  // Determine redirect based on user role
  let redirectTo = "/internal";
  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "professor" || profile?.role === "admin") {
      redirectTo = "/professor";
    }
  }

  redirect(redirectTo);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getSession() {
  return getAuthUser();
}
