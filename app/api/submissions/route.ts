import { NextRequest } from 'next/server';
import { adminClient, currentUser, jsonError, requireAdmin } from '../_lib/server';
export async function GET(req: NextRequest) {
  const user = await currentUser(req); if (!user) return jsonError('Login required', 401);
  const admin = await requireAdmin(req); const db = adminClient();
  let q = db.from('submissions').select('*').order('created_at', { ascending: false });
  q = admin ? q : q.eq('user_id', user.id);
  const status = req.nextUrl.searchParams.get('status'); if (status) q = q.eq('status', status);
  const { data, error } = await q; return error ? jsonError(error.message,500) : Response.json(data);
}
export async function POST(req: NextRequest) {
  const user = await currentUser(req); if (!user) return jsonError('Login required',401);
  const b = await req.json();
  for (const k of ['title','author_name','email','category','content']) if (!b[k]?.trim()) return jsonError(`${k} is required`);
  if (b.content.trim().length < 100) return jsonError('Story content must be at least 100 characters');
  const { data, error } = await adminClient().from('submissions').insert({
    user_id:user.id,title:b.title.trim(),author_name:b.author_name.trim(),email:b.email.trim(),college:b.college||null,
    linkedin_url:b.linkedin_url||null,category:b.category,content:b.content.trim(),image_url:b.image_url||null,
  }).select().single();
  if (!error) {
    await adminClient().from('profiles').update({ xp: 50 }).eq('id', user.id).lt('xp', 50);
    await adminClient().from('activity_events').insert({ user_id:user.id,event_type:'submission',entity_id:data.id,xp_delta:50 });
  }
  return error ? jsonError(error.message,500) : Response.json(data,{status:201});
}
