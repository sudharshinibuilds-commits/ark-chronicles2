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

  // Get founder application details first
  const { data: founder, error: findError } = await db
    .from("founders")
    .select("user_id")
    .eq("id", id)
    .single();

  if (findError || !founder) {
    return jsonError("Founder application not found", 404);
  }

  // Update status
  const { data, error } = await db
    .from("founders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  // If approved, update user's role to founder in profiles
  if (status === "approved" && founder.user_id) {
    await db
      .from("profiles")
      .update({ role: "founder" })
      .eq("id", founder.user_id);
  }

  return Response.json(data);
}
