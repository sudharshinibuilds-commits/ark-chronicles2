import { NextRequest } from "next/server";
import { adminClient, jsonError, requireAdmin } from "../../_lib/server";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const q = req.nextUrl.searchParams.get("q")?.trim();
  const db = adminClient();
  let query = db.from("profiles").select("*");

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,college.ilike.%${q}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  return error ? jsonError(error.message, 500) : Response.json(data);
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const b = await req.json();
  const { userId, role } = b;

  if (!userId || !role) return jsonError("userId and role are required");

  const validRoles = ["member", "founder", "investor", "journalist", "admin"];
  if (!validRoles.includes(role)) return jsonError("Invalid role specified");

  const { data, error } = await adminClient()
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  return error ? jsonError(error.message, 500) : Response.json(data);
}
