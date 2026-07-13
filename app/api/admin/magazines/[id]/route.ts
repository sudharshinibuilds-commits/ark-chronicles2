import { NextRequest } from "next/server";
import { adminClient, jsonError, requireAdmin } from "../../../_lib/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const { id } = await params;
  const b = await req.json();
  const { published } = b;

  if (typeof published !== "boolean") {
    return jsonError("published status must be a boolean");
  }

  const { data, error } = await adminClient()
    .from("magazines")
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select()
    .single();

  return error ? jsonError(error.message, 500) : Response.json(data);
}
