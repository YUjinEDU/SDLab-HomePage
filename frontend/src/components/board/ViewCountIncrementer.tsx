"use client";

import { useEffect } from "react";
import { incrementViewCount } from "@/actions/announcements";

export function ViewCountIncrementer({ id }: { id: number }) {
  useEffect(() => {
    incrementViewCount(id);
  }, [id]);

  return null;
}
