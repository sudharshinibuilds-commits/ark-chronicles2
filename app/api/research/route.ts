import { NextRequest } from "next/server";
import { adminClient, jsonError, requireAdmin } from "../_lib/server";

export async function GET(req: NextRequest) {
  const db = adminClient();
  const admin = await requireAdmin(req);
  const includeUnpublished = req.nextUrl.searchParams.get("include_unpublished") === "true" && admin;

  let query = db.from("research_papers").select("*");
  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const domain = req.nextUrl.searchParams.get("domain");
  const college = req.nextUrl.searchParams.get("college");
  if (domain) query = query.eq("domain", domain);
  if (college) query = query.eq("college", college);

  const { data, error } = await query.order("created_at", { ascending: false });
  return error ? jsonError(error.message, 500) : Response.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return jsonError("Admin access required", 403);
  const b = await req.json();

  const isPublished = b.published !== undefined ? Boolean(b.published) : true;

  const { data, error } = await adminClient()
    .from("research_papers")
    .insert({
      title: b.title,
      authors: b.authors,
      abstract: b.abstract || null,
      domain: b.domain || null,
      college: b.college || null,
      citation_text: b.citation_text || null,
      pdf_url: b.pdf_url,
      published: isPublished,
    })
    .select()
    .single();

  return error ? jsonError(error.message, 500) : Response.json(data, { status: 201 });
}
