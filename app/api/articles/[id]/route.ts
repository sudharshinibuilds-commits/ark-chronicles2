import { NextRequest } from "next/server";
import { adminClient, jsonError, requireAdmin } from "../../_lib/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = adminClient();
  const admin = await requireAdmin(req);
  const col = id.includes("-") && id.length !== 36 ? "slug" : "id";

  let query = db.from("articles").select("*").eq(col, id);
  if (!admin) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.single();
  return error ? jsonError("Article not found", 404) : Response.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const { id } = await params;
  const b = await req.json();

  const updates: Record<string, any> = {};
  if (b.title !== undefined) updates.title = b.title;
  if (b.excerpt !== undefined) updates.excerpt = b.excerpt;
  if (b.content !== undefined) updates.content = b.content;
  if (b.category !== undefined) updates.category = b.category;
  if (b.image_url !== undefined) updates.image_url = b.image_url;
  if (b.featured !== undefined) updates.featured = b.featured;
  if (b.published !== undefined) {
    updates.published = b.published;
    if (b.published) {
      updates.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await adminClient()
    .from("articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return error ? jsonError(error.message, 500) : Response.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError("Admin access required", 403);

  const { id } = await params;

  const { error } = await adminClient()
    .from("articles")
    .delete()
    .eq("id", id);

  return error ? jsonError(error.message, 500) : Response.json({ success: true });
}
