"use client";

import { useEffect } from "react";
import { unlock, type AchievementId } from "@/lib/achievements";

/** Unlocks an achievement when a page is visited. Renders nothing. */
export function UnlockOnMount({ id }: { id: AchievementId }) {
  useEffect(() => unlock(id), [id]);
  return null;
}
