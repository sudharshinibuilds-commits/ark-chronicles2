import { NextRequest } from "next/server";
import { adminClient, jsonError, requireAdmin } from "../../../_lib/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const { id } = await params;
  const b = await req.json();
  const { status } = b;

  if (!["approved", "rejected"].includes(status)) {
    return jsonError("Invalid status");
  }

  const db = adminClient();

  const { data, error } = await db
    .from("college_applications")
    .update({
      status,
      verified: status === "approved" ? true : false,
    })
    .eq("id", id)
    .select()
    .single();

  return error ? jsonError(error.message, 500) : Response.json(data);
}
