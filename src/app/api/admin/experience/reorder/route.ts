import type { NextRequest } from "next/server";
import { Experience } from "@/lib/db/models";
import { reorderHandler } from "@/lib/api-crud";
import { withAdminAuth } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const PATCH = withAdminAuth(async (req: NextRequest) =>
  reorderHandler(req, Experience, [CACHE_TAGS.experiences]),
);
