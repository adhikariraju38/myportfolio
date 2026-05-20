import type { NextRequest } from "next/server";
import { NavMenuItem } from "@/lib/db/models";
import { reorderHandler } from "@/lib/api-crud";
import { withAdminAuth } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const PATCH = withAdminAuth(async (req: NextRequest) =>
  reorderHandler(req, NavMenuItem, [CACHE_TAGS.nav]),
);
