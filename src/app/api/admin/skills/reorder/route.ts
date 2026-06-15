import type { NextRequest } from "next/server";
import { skills } from "@/lib/db/schema";
import { reorderHandler } from "@/lib/api-crud";
import { withAdminAuth } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const PATCH = withAdminAuth(async (req: NextRequest) =>
  reorderHandler(req, skills, [CACHE_TAGS.skills]),
);
