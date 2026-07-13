import { NextRequest } from "next/server";
import { adminClient, jsonError, requireAdmin } from "../_lib/server";

export async function GET(req: NextRequest) {
  const db = adminClient();
  const admin = await requireAdmin(req);
  const includeUnpublished = req.nextUrl.searchParams.get("include_unpublished") === "true" && admin;

  let query = db.from("magazines").select("*");
  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  return error ? jsonError(error.message, 500) : Response.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return jsonError("Admin access required", 403);
  const b = await req.json();

  const isPublished = b.published !== undefined ? Boolean(b.published) : true;

  const { data, error } = await adminClient()
    .from("magazines")
    .insert({
      title: b.title,
      issue_no: b.issue_no || null,
      description: b.description || null,
      cover_url: b.cover_url || null,
      pdf_url: b.pdf_url,
      published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .select()
    .single();

  return error ? jsonError(error.message, 500) : Response.json(data, { status: 201 });
}
