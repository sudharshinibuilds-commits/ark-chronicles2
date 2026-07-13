import { NextRequest } from 'next/server';
import { adminClient, jsonError, requireAdmin } from '../../../_lib/server';
export async function POST(req: NextRequest,{params}:{params:Promise<{id:string}>}){
 const admin=await requireAdmin(req); if(!admin)return jsonError('Admin access required',403);
 const {id}=await params; const b=await req.json();
 if(!['approved','rejected'].includes(b.status))return jsonError('Invalid status');
 const db=adminClient();
 if(b.status==='approved'){
  const {data,error}=await db.rpc('approve_submission',{p_submission:id,p_admin:admin.id});
  return error?jsonError(error.message,500):Response.json({article_id:data,status:'approved'});
 }
 const {data,error}=await db.from('submissions').update({status:'rejected',review_note:b.note||null,reviewed_by:admin.id,reviewed_at:new Date().toISOString()}).eq('id',id).select().single();
 return error?jsonError(error.message,500):Response.json(data);
}
