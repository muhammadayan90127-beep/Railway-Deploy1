# MH Interior Design

A luxury interior design consultation website for MH Interior Design, Amroha, UP. Includes booking consultations, reviews, admin panel, user authentication, and an AI chat widget.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/luxury-app run dev` — run the frontend (port 25529)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned on Replit)
- Optional env: `SESSION_SECRET` — JWT secret (falls back to hardcoded dev value)
- Optional env: `ADMIN_PASSWORD` — Admin panel password (default: `mhinterior2025`)
- Optional env: `RESEND_API_KEY` — for sending email notifications

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite 7, Tailwind CSS 4, Framer Motion, wouter
- API: Express 5, Pino logging
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Auth: JWT (bcryptjs + jsonwebtoken)
- Email: Resend
- QR Codes: qrcode

## Where things live

- **Frontend**: `artifacts/luxury-app/src/`
  - Pages: `src/pages/` (MainPage, LoginPage, RegisterPage, DashboardPage, SettingsPage, AdminPanel, VerifyPage)
  - Components: `src/components/` (HeroSection, BookingSection, ServicesSection, PortfolioSection, ReviewForm, ChatWidget, etc.)
  - Auth context: `src/contexts/AuthContext.tsx`
- **Backend**: `artifacts/api-server/src/routes/` (auth, bookings, reviews, contacts, admin, chat)
- **DB Schema**: `lib/db/src/schema/` (users, bookings, reviews, contacts, services, slots)
- **API Spec**: `lib/api-spec/openapi.yaml`
- **Railway Config**: `railway.json` at root

## Architecture decisions

- Single-page React app with client-side routing via wouter
- JWT auth stored in localStorage (`mh_user_token`, `mh_admin_token`)
- Admin panel uses password-based auth (separate from customer JWT)
- In production (Railway), the API server serves the built frontend static files
- Chat widget uses keyword-based responses (no external LLM needed)
- QR codes generated server-side for booking verification

## Railway Deployment

The app is fully Railway-ready. Set these environment variables in Railway:
- `DATABASE_URL` — PostgreSQL connection string (use Railway's Postgres plugin)
- `SESSION_SECRET` — a random secret string for JWT signing
- `ADMIN_PASSWORD` — password for the `/admin` panel
- `RESEND_API_KEY` — (optional) for email notifications

Build command and start command are configured in `railway.json`.

## Product

- **Main page**: Hero, Services, Portfolio, About, Testimonials, Contact, Chat widget, WhatsApp button
- **Booking**: Users register/login, then book consultation slots with QR code confirmation
- **Admin panel** (`/admin`): Password-protected; manage bookings, reviews, contacts, users
- **User dashboard** (`/dashboard`): View own bookings, scan QR verification
- **Reviews**: Public submission, admin moderation, pin featured reviews

## User preferences

- No pages removed, no new pages added — faithful port of the original project
- Railway-compatible: single deploy button deploys everything

## Gotchas

- The vite.config.ts no longer throws on missing PORT/BASE_PATH — defaults to port 3000 and base path "/"
- In production, the API server serves the frontend static files from `artifacts/luxury-app/dist/public`
- The DB schema push must be run before starting the API server for the first time
- The `qrcode` package is in `dependencies` (not `devDependencies`) for the luxury-app since it's used at runtime in the browser

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
