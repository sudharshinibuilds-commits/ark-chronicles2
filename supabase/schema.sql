-- ARK Chronicles complete backend schema (run once in Supabase SQL editor)
create extension if not exists pgcrypto;

create type public.user_role as enum ('member','founder','investor','journalist','admin');
create type public.review_status as enum ('pending','approved','rejected');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text not null default '', username text unique,
  college text, bio text, avatar_url text, cover_url text,
  skills text[] not null default '{}', interests text[] not null default '{}',
  linkedin_url text, contact_email text,
  role public.user_role not null default 'member',
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_active_date date,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null, excerpt text, content text not null,
  author_name text not null, author_id uuid references public.profiles(id) on delete set null,
  category text not null, tags text[] not null default '{}', image_url text,
  published boolean not null default false, featured boolean not null default false,
  read_count bigint not null default 0,
  published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists articles_public_idx on public.articles(published, published_at desc);
create index if not exists articles_search_idx on public.articles using gin(to_tsvector('english', title || ' ' || coalesce(excerpt,'') || ' ' || content));

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, author_name text not null, email text not null, college text, linkedin_url text,
  category text not null, content text not null, image_url text,
  status public.review_status not null default 'pending', review_note text,
  reviewed_by uuid references public.profiles(id), reviewed_at timestamptz,
  article_id uuid references public.articles(id), created_at timestamptz not null default now()
);

create table if not exists public.founders (
  id uuid primary key default gen_random_uuid(), user_id uuid unique references public.profiles(id) on delete cascade,
  name text not null, company text not null, headline text, bio text, photo_url text,
  linkedin_url text, email text, website_url text, status public.review_status not null default 'pending',
  strike_rate numeric(5,2) not null default 0, created_at timestamptz not null default now()
);

create table if not exists public.magazines (
  id uuid primary key default gen_random_uuid(), title text not null, issue_no text, description text,
  cover_url text, pdf_url text not null, published boolean not null default false,
  published_at timestamptz, created_at timestamptz not null default now()
);

create table if not exists public.research_papers (
  id uuid primary key default gen_random_uuid(), title text not null, authors text not null,
  abstract text, domain text, college text, citation_text text, pdf_url text not null,
  published boolean not null default false, created_at timestamptz not null default now()
);

create table if not exists public.college_applications (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.profiles(id),
  college_name text not null, contact_name text not null, email text not null, website_url text,
  proposal text not null, status public.review_status not null default 'pending', verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.investor_requests (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.profiles(id),
  investor_name text not null, email text not null, company text, message text not null,
  status public.review_status not null default 'pending', created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(), email text unique not null, active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_events (
  id bigint generated always as identity primary key, user_id uuid references public.profiles(id) on delete cascade,
  event_type text not null, entity_id uuid, xp_delta integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists activity_recent_idx on public.activity_events(created_at desc);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(), code text unique not null, name text not null,
  description text not null, min_xp integer not null, icon text not null default '🏆'
);
create table if not exists public.user_badges (
  user_id uuid references public.profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(), primary key(user_id,badge_id)
);

insert into public.badges(code,name,description,min_xp,icon) values
('starter','Rising Reader','Earn 100 XP',100,'📖'),('builder','Knowledge Builder','Earn 500 XP',500,'🏗️'),
('champion','ARK Champion','Earn 1000 XP',1000,'🏆') on conflict(code) do nothing;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,email,name,username,college,role)
  values(new.id,new.email,coalesce(new.raw_user_meta_data->>'name',''),
    nullif(lower(regexp_replace(coalesce(new.raw_user_meta_data->>'name','user') || '-' || substr(new.id::text,1,6),'[^a-z0-9-]','','g')),''),
    new.raw_user_meta_data->>'college','member') on conflict(id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.approve_submission(p_submission uuid, p_admin uuid) returns uuid
language plpgsql security definer set search_path=public as $$
declare s public.submissions; a uuid; base_slug text;
begin
  select * into s from public.submissions where id=p_submission for update;
  if not found or s.status <> 'pending' then raise exception 'Submission unavailable'; end if;
  if not exists(select 1 from public.profiles where id=p_admin and role='admin') then raise exception 'Forbidden'; end if;
  base_slug := trim(both '-' from regexp_replace(lower(s.title),'[^a-z0-9]+','-','g')) || '-' || substr(s.id::text,1,8);
  insert into public.articles(slug,title,content,author_name,author_id,category,image_url,published,published_at)
  values(base_slug,s.title,s.content,s.author_name,s.user_id,s.category,s.image_url,true,now()) returning id into a;
  update public.submissions set status='approved',reviewed_by=p_admin,reviewed_at=now(),article_id=a where id=p_submission;
  update public.profiles set xp=xp+200 where id=s.user_id;
  insert into public.activity_events(user_id,event_type,entity_id,xp_delta) values(s.user_id,'published',a,200);
  return a;
end $$;

create or replace function public.record_article_read(p_article uuid, p_user uuid default null) returns void
language plpgsql security definer set search_path=public as $$
begin
 update public.articles set read_count=read_count+1 where id=p_article and published=true;
 if p_user is not null then
   if not exists(select 1 from public.activity_events where user_id=p_user and event_type='read' and entity_id=p_article and created_at>now()-interval '24 hours') then
    insert into public.activity_events(user_id,event_type,entity_id,xp_delta) values(p_user,'read',p_article,10);
    update public.profiles set xp=xp+10,
      streak=case when last_active_date=current_date-1 then streak+1 when last_active_date=current_date then streak else 1 end,
      last_active_date=current_date where id=p_user;
   end if;
 end if;
end $$;

alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.submissions enable row level security;
alter table public.founders enable row level security;
alter table public.magazines enable row level security;
alter table public.research_papers enable row level security;
alter table public.college_applications enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.activity_events enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

create policy "public profiles readable" on public.profiles for select using(true);
create policy "own profile editable" on public.profiles for update using(auth.uid()=id) with check(auth.uid()=id);
create policy "published articles readable" on public.articles for select using(published=true or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "own submissions" on public.submissions for select using(user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "submit own story" on public.submissions for insert with check(user_id=auth.uid());
create policy "approved founders readable" on public.founders for select using(status='approved' or user_id=auth.uid());
create policy "published magazines readable" on public.magazines for select using(published=true);
create policy "published research readable" on public.research_papers for select using(published=true);
create policy "own college application" on public.college_applications for insert with check(user_id=auth.uid());
create policy "badges readable" on public.badges for select using(true);
create policy "own badges readable" on public.user_badges for select using(user_id=auth.uid());
create policy "activity readable" on public.activity_events for select using(true);

insert into storage.buckets(id,name,public) values ('story-images','story-images',true),('magazines','magazines',true),('research','research',true),('avatars','avatars',true) on conflict(id) do nothing;
create policy "authenticated story upload" on storage.objects for insert to authenticated with check(bucket_id='story-images');
create policy "public storage read" on storage.objects for select using(bucket_id in ('story-images','magazines','research','avatars'));
