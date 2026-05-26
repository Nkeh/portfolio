# Ransom Portfolio

A dynamic, API-driven portfolio built with Next.js 15, Prisma, PostgreSQL, Framer Motion, and Tailwind CSS.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Push database schema
```bash
npm run db:push
```

### 4. Seed the database
```bash
npm run db:seed
```

### 5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📁 Project Structure
```
app/
  (site)/          # Public portfolio pages
  (admin)/         # Protected admin dashboard
  api/             # API routes
components/
  layout/          # Navbar, Footer, AdminSidebar
  sections/        # About, Resume, Projects, Blog, Reviews, Contact
  ui/              # Reusable Motion components
lib/               # db, auth, email, utils
prisma/            # Schema + seed
styles/            # Global CSS + design tokens
public/            # logo.png, resume.pdf
```

## 🎨 Design System
- **Fonts**: Syne (display) · DM Mono (code) · Outfit (body)
- **Colors**: `#080A08` background · `#00C853` green accent (from logo)
- **Components**: All styled via CSS variables in `styles/globals.css`

## 🔧 Customization
- Edit seed data in `prisma/seed.ts`
- Update social links in `components/sections/Contact/ContactSection.tsx`
- Update social links in `components/layout/Footer.tsx`
- Add/update your `public/logo.png` and `public/resume.pdf`

## 🌐 Deploy to Vercel
1. Push to GitHub
2. Import in Vercel → set all env vars
3. Deploy — `prisma generate` runs automatically via `vercel.json`

## 🔑 Admin Access
- URL: `/admin/login`
- Credentials: set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`
- Run `npm run db:seed` to create the admin account
