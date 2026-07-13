import { NextRequest } from "next/server";
import { adminClient, currentUser, jsonError, requireAdmin } from "../_lib/server";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const { data, error } = await adminClient()
    .from("investor_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return error ? jsonError(error.message, 500) : Response.json(data);
}

export async function POST(req: NextRequest) {
  const user = await currentUser(req);
  if (!user) return jsonError("Login required", 401);

  const b = await req.json();
  const { investor_id, startup_name, stage, ask, pitch } = b;

  if (!investor_id) return jsonError("Investor ID is required");
  if (!startup_name) return jsonError("Startup name is required");

  const db = adminClient();

  // Fetch investor profile details
  const { data: investor, error: invError } = await db
    .from("profiles")
    .select("name, email, bio")
    .eq("id", investor_id)
    .single();

  if (invError || !investor) {
    return jsonError("Investor not found", 404);
  }

  // Pack the pitch and request data into message
  const messageData = {
    investor_id,
    startup_name,
    stage,
    ask,
    pitch,
  };

  const { data, error } = await db
    .from("investor_requests")
    .insert({
      user_id: user.id,
      investor_name: investor.name || "Unknown Investor",
      email: investor.email || "no-email@ark.com",
      company: investor.bio || "", // Using bio/company field for investor company
      message: JSON.stringify(messageData),
      status: "pending",
    })
    .select()
    .single();

  return error ? jsonError(error.message, 500) : Response.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const b = await req.json();
  const { id, status } = b;

  if (!id || !status) return jsonError("ID and status are required");

  const { data, error } = await adminClient()
    .from("investor_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  return error ? jsonError(error.message, 500) : Response.json(data);
}
