# SignalReach

Premium static marketing website concept for a website audit / QA service.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Pages

- `/` - Home
- `/how-it-works` - How It Works
- `/services` - Services
- `/about` - About
- `/free-report` - Free Website Report
- `/super-admin` - Private Super Admin dashboard (Supabase Auth + RLS; not linked publicly — see `supabase/SUPER_ADMIN_SETUP.md`)

## Architecture

- Next.js App Router
- Plain CSS Modules, no Tailwind
- Global typography and color tokens in `src/app/globals.css`
- Shared global Header / Footer
- Each page section has its own folder with component + CSS module
- Static form flow for now; backend/email integration can be added later

## Fonts

- Headings & statistics: Manrope (`--font-heading`)
- Paragraph/body/forms: Inter (`--font-body`)
- Buttons/navigation/links/UI labels: DM Sans (`--font-ui`)

All sizes, weights, line-heights and letter-spacing are tokens in `src/app/globals.css` (`--h1-size`, `--h1-weight`, `--p-size`, `--btn-size`, …).

Fonts are loaded using `next/font/google`.

## Supabase

- The Free Report form inserts into `public.qa_report_requests` (anonymous INSERT only).
- The Super Admin dashboard reads/updates those rows through Row Level Security; only users listed in `public.admin_users` with role `super_admin` get access.
- Migrations live in `supabase/migrations/`. Admin setup steps: `supabase/SUPER_ADMIN_SETUP.md`.
- Environment variables: copy `.env.example` to `.env.local`. Only public keys are used — never add the service-role key.
