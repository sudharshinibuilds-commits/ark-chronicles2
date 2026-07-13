import { NextRequest } from 'next/server';
import { adminClient, currentUser, jsonError } from '../_lib/server';
export async function GET(req:NextRequest){const u=await currentUser(req);if(!u)return jsonError('Login required',401);const {data,error}=await adminClient().from('profiles').select('*').eq('id',u.id).single();return error?jsonError(error.message,500):Response.json(data)}
export async function PATCH(req:NextRequest){const u=await currentUser(req);if(!u)return jsonError('Login required',401);const b=await req.json();delete b.role;delete b.xp;delete b.streak;delete b.id;const {data,error}=await adminClient().from('profiles').update({...b,updated_at:new Date().toISOString()}).eq('id',u.id).select().single();return error?jsonError(error.message,500):Response.json(data)}
