# Vaultify 🔐

Vaultify is a password‑manager web app built with Next.js (App Router).  
It lets users store, search, and manage credentials securely.

---

## 🎯 Features

- User authentication (NextAuth or similar)
- Password storing, viewing, editing, deleting
- Search system that filters password entries
- Clean UI with custom components (DataTable, etc.)
- Responsive and styled with your custom theme

---

## 🛠️ Prerequisites

You should have these installed:

- Node.js (v16 or newer recommended)
- npm or yarn or pnpm
- Database ( MongoDB )
- Environment variables (see below)

---

## 🚀 Getting Started (Local Development)

1. Clone the repo:

   ```bash
   git clone https://github.com/mishra0703/vaultify.git
   cd vaultify
   ```

2. Install dependencies:

   ```bash
   npm install
   # or yarn
   # or pnpm install
   npm install mongodb
   npm install mongoose
   npm install crypto-js
   npm install @hugeicons/core-free-icons
   npm install @hugeicons/react
   npm install framer-motion
   npm install lucide-react
   npm install next-auth
   ```

3. Create a `.env.local` file in the root and add environment variables. Example:

   ```
   MONGODB_URI = mongodb://localhost:27017
   NEXTAUTH_SECRET=Your_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_ENCRYPTION_KEY=Your_Encryption_key
   ENCRYPTION_SECRET=Your_encryption_secret
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or yarn dev
   # or pnpm dev
   ```

5. Open your browser:

   Go to [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Project Structure (high-level)

```
/
├── app/                      # Next.js App Router files — pages, layouts, etc.
├── components/               # Reusable React components, e.g. Navbar, DataTable
├── db/                       # Database / model / ORM setup (if any)
├── lib/                      # Utility functions, custom hooks, etc.
├── public/                   # Static files: images, icons, etc.
├── styles / globals.css      # Global styling
├── next.config.mjs
├── package.json
└── …
```

---

## 🔍 Search & Results Flow

- The **SearchPanel** (client component) captures the user’s input.
- It navigates to `/results?query=...` on search submission.
- The `app/results/page.js`:
  - Reads the `query` from the URL.
  - If no query is present, redirects to `/password-manager`.
  - Fetches the password data from the API endpoint (e.g. `/api/passwords`).
  - Filters entries whose URL, username or remarks match the `query`.
  - Presents results via your `DataTable` component.

---

## ✅ Deployment

You can deploy this project using Vercel (recommended for Next.js), or any hosting that supports Next.js.

1. Push your code to GitHub (or Git provider).
2. Import project in Vercel.
3. Add required environment variables in Vercel dashboard.
4. Deploy — Vercel will handle building and serving.

---

## 🧠 Troubleshooting & Tips

- If `useSession()` fails, make sure the file has `"use client"` at top (because it's a client component).
- Ensure your `SessionProvider` (or `SessionWrapper`) wraps components where session is consumed.
- For pages under `app/` that need to use React hooks (e.g. `useState`, `useEffect`, `useSession`), you must add `"use client"`.

---