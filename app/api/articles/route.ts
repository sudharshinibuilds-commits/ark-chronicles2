import { NextRequest } from 'next/server';
import { adminClient, jsonError, requireAdmin } from '../_lib/server';

export async function GET(req: NextRequest) {
  const db = adminClient();
  const admin = await requireAdmin(req);
  const q = req.nextUrl.searchParams.get('q')?.trim();
  const category = req.nextUrl.searchParams.get('category')?.trim();
  const includeUnpublished = req.nextUrl.searchParams.get('include_unpublished') === "true" && admin;
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 30), 100);
  
  let query = db.from('articles').select('*');
  if (!includeUnpublished) {
    query = query.eq('published', true);
  }
  query = query.order('published_at', { ascending: false }).limit(limit);
  
  if (category) query = query.eq('category', category);
  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`);
  const { data, error } = await query;
  return error ? jsonError(error.message, 500) : Response.json(data);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return jsonError('Admin access required', 403);
  const body = await req.json();
  if (!body.title || !body.content || !body.category) return jsonError('Title, content and category are required');
  const slug = `${String(body.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;
  const { data, error } = await adminClient().from('articles').insert({
    slug, title: body.title, excerpt: body.excerpt || null, content: body.content,
    author_name: body.author_name || body.author || 'ARK Editorial', author_id: admin.id,
    category: body.category, tags: body.tags || [], image_url: body.image_url || null,
    featured: Boolean(body.featured), published: true, published_at: new Date().toISOString(),
  }).select().single();
  return error ? jsonError(error.message, 500) : Response.json(data, { status: 201 });
}
