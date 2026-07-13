# ARK Chronicles Backend Setup

## 1. Create/configure Supabase
1. Open the project in Supabase.
2. SQL Editor → New query → paste and run `supabase/schema.sql`.
3. Authentication → URL Configuration:
   - Site URL: your Vercel URL
   - Redirect URLs: `http://localhost:3000/**` and `https://YOUR_DOMAIN/**`
4. Create the first admin account normally, then run:
   ```sql
   update public.profiles set role='admin' where email='YOUR_ADMIN_EMAIL';
   ```

## 2. Environment variables
Copy `.env.example` to `.env.local`. Add the same values in Vercel → Project Settings → Environment Variables.

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_` and never commit the real value.

## 3. Run
```bash
npm install
npm run dev
```

## Implemented backend modules
- Auth profile creation trigger, roles and RLS
- Protected server API with access-token verification
- Real article list/search/filter and article detail API
- Story image upload and submission flow
- Admin approval/rejection; approval publishes an article transactionally
- Profiles API
- Founder applications
- College collaboration applications
- Published magazines and research APIs
- Newsletter subscriptions
- Read counting, XP and streak tracking
- Badges schema and admin analytics endpoint
- Storage buckets/policies for story images, magazines, research and avatars

## API summary
- `GET/POST /api/articles`
- `GET /api/articles/:id-or-slug`
- `GET/POST /api/submissions`
- `POST /api/submissions/:id/review`
- `GET/PATCH /api/profile`
- `GET /api/admin/stats`
- `GET/POST /api/founder-applications`
- `GET/POST /api/college-applications`
- `GET/POST /api/research`
- `GET/POST /api/magazines`
- `POST /api/newsletter`
- `POST /api/activity/read`

Authenticated requests send `Authorization: Bearer <Supabase access token>`.

## Email notifications
The database and review flow work without email. To enable production email, add a verified domain and `RESEND_API_KEY`; connect the review route to Resend or a Supabase Edge Function. Keys are deliberately not included.
