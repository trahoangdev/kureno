# Kureno Website – Full‑stack Next.js App

A full‑stack e‑commerce + CMS style application built with Next.js (App Router), Tailwind CSS, shadcn/ui, and MongoDB via Mongoose. The project ships with user and admin areas, authentication, product/blog management, orders, messages, categories, and a complete local development workflow.

## Tech Stack
- Next.js 14 (App Router, Server/Client Components)
- TypeScript, Tailwind CSS, shadcn/ui components
- NextAuth (Credentials) for auth
- MongoDB + Mongoose models
- Radix UI primitives, lucide-react icons

## Project Structure
```
app/
  page.tsx, about/, blog/, products/, checkout/, contact/, login/, register/
  admin/                 # Admin app (guarded by middleware)
    page.tsx             # Dashboard
    products/            # List, new, detail, edit
    categories/          # Category management
    orders/              # List with filters, bulk actions, drawer detail
    customers/           # List + detail
    blog/                # Blog list + quick publish/unpublish
    messages/            # Contact messages (search, bulk actions)
    settings/            # Admin settings (stub)
  api/                   # API routes (Next.js serverless)
    auth/[...nextauth]/  # NextAuth credential provider
    products/, orders/, blog/, user/, admin/users/, categories/, ...
components/              # UI, layout, providers
context/                 # Cart context
lib/                     # db connection and models
scripts/                 # seed & utilities
```

## Features
- Public storefront pages (home, products, product detail, blog, contact, checkout)
- Authentication (credentials) with role support (admin, user)
- Admin area
  - Products: list/search, category filter, create/edit with image preview, delete
  - Orders: server pagination, filters, bulk actions (processing/shipped/delivered/cancel), CSV export, detail drawer + status timeline
  - Blog: list from DB, publish/unpublish, TipTap editor page for content
  - Messages: search, read/unread, delete, bulk actions, CSV export
  - Customers: list from DB, detail page, quick lock/unlock
  - Categories: CRUD with slug/name validation (client + server)
- Middleware guards for `/admin/*` and `/api/admin/*` with subdomain rewrite support (`admin.localhost` optional)

## Getting Started
1) Install dependencies
```bash
npm install
```

2) Create `.env.local`
```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster/dbname
NEXTAUTH_SECRET=your-strong-random-secret
```

3) Seed sample data (1 admin, 3 users, 15 products, 15 blog posts)
```powershell
# Windows PowerShell
$env:MONGODB_URI="<your-uri>"; npm run seed
```

4) Run the app
```bash
npm run dev
```
App runs at `http://localhost:3000`.

## Auth
- Admin login: `/admin/login`
- User login: `/login`
- Middleware protects admin routes; non‑admin page visits to `/admin/*` redirect home.

Default seeded accounts:
- Admin: `admin@kureno.dev` / `Admin@123`
- Users: `alice@example.com`, `bob@example.com`, `carol@example.com` (password `Password1`)

## Development Notes
- API routes live under `app/api/*`. All admin‑only endpoints check session role.
- DB connection is centralized in `lib/db.ts` (cached across requests/hot reload).
- Models are in `lib/models/*` (User, Product, Order, BlogPost, Message, Category).
- UI components are in `components/` and `components/ui/` (shadcn/ui).
- Admin layout in `app/admin/layout.tsx` hides public navbar/footer and includes sidebar.

## Useful Scripts
```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run seed       # Seed database (uses MONGODB_URI env)
```

## Admin UX Highlights
- Sidebar navigation, sticky header actions (settings, account menu)
- Full‑width content pages or 2‑column layout where appropriate
- Consistent tables with actions menu, empty/loading states

## Extending
- Add new models in `lib/models/*` and corresponding API under `app/api/*`
- Follow existing patterns for list/detail/edit pages under `app/admin/*`
- For protected pages, rely on middleware and/or server checks with `getServerSession`

## License
This project is provided as‑is for internal use and learning purposes.

## Designed and developed with ❤️ by trahoangdev