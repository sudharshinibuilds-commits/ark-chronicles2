import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function adminClient() {
  if (!url || !service) throw new Error('Missing Supabase server environment variables');
  return createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function currentUser(req: NextRequest) {
  if (!url || !anon) return null;
  const header = req.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  const client = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(token);
  return error ? null : data.user;
}

export async function requireAdmin(req: NextRequest) {
  const user = await currentUser(req);
  if (!user) return null;
  const db = adminClient();
  const { data } = await db.from('profiles').select('role').eq('id', user.id).single();
  return data?.role === 'admin' ? user : null;
}

export const jsonError = (message: string, status = 400) =>
  Response.json({ error: message }, { status });
