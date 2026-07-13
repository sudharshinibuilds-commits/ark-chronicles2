import { NextRequest } from "next/server";
import { adminClient, jsonError, requireAdmin } from "../../_lib/server";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const { data, error } = await adminClient()
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return error ? jsonError(error.message, 500) : Response.json(data);
}
