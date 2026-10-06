# On Par Marketing Roadmap

Production-oriented Next.js dashboard for planning On Par Entertainment marketing events.

## What Is Built

- Rolling 12-month roadmap generator
- First-Wednesday trivia rule
- First-Thursday bingo rule
- Paid-event week placeholders outside the first week
- Permanent November 16 anniversary placeholder with anniversary number
- Master calendar with month, week, and agenda views
- Drag-to-reschedule with conflict warnings
- Dashboard widgets
- Bingo dropdown with an embedded OPE Bingo host console and quick links to the dashboard, host, and TV display
- Recommendation inbox
- Manual staff recommendation form
- Approval, denial, archive, merge, and research-request actions
- Event detail/report editor
- Printable event packet layout
- Marketing timeline and task views
- Budget overview with low/expected/high scenarios
- CSV import for existing events
- Research log
- Event templates
- PostgreSQL Prisma schema for the full product model
- Vercel Cron endpoint in dry-run recommendation mode
- Optional Basic Auth protection through environment variables

The AI and cron paths never approve, publish, contact vendors, spend money, or create ticket listings automatically.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run typecheck
npx prisma validate
npm run build
```

Prisma validation needs a local `.env` with `DATABASE_URL`. Use `.env.example` as the template.

## Environment Variables

Set these in Vercel when enabling the full production integrations:

```text
DATABASE_URL
AUTH_SECRET
NEXTAUTH_SECRET
AI_GATEWAY_API_KEY
WEB_SEARCH_API_KEY
EVENTBRITE_API_KEY
CRON_SECRET
MARKETING_ROADMAP_USER
MARKETING_ROADMAP_PASSWORD
```

If `MARKETING_ROADMAP_USER` and `MARKETING_ROADMAP_PASSWORD` are set, the app requires Basic Auth. If they are not set, the dashboard remains open.

## Data Persistence

Phase 1 uses generated seed data plus browser local storage for interactive edits. The Prisma PostgreSQL schema is included in `prisma/schema.prisma` so the next phase can move writes to the database without redesigning the product model.

## Cron

`vercel.json` schedules:

```text
/api/cron/recommendations
```

The endpoint currently runs in safe dry-run mode and returns recommendations requiring human approval. Set `CRON_SECRET` to require bearer-token authorization.

## Deployment

This repo is connected to Vercel. Pushes to `main` redeploy the production site.
