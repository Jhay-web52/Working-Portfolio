# 🚀 Joel Oguntade — Portfolio

My personal portfolio site: a fast, animated Next.js app that showcases who I am, what I've built, and how to reach me. The project section isn't static data — it talks to the GitHub API live, and I run a small password-protected admin panel behind it to curate what shows up.

🔗 **Live Demo:** https://joeloguntade.vercel.app

---

## 📌 Overview

This is more than a static landing page. Under the hood it has its own backend layer:

- The **project showcase pulls directly from the GitHub API** for my account at request time — no hardcoded project list to keep in sync.
- An **approvals layer**, backed by **Vercel KV / Upstash Redis** in production, decides which of my repos are shown and lets me attach a custom description or live demo link per project without touching code.
- A **password-protected `/admin` panel** lets me approve/disapprove projects and edit their copy, writing straight to that persistent store.

---

## ✨ **Key Features**

- 📱 **Fully responsive, mobile-first design**
- 🎬 **Smooth, interactive animations powered by Framer Motion**
- 🧩 **Reusable, well-structured React component architecture**
- ⚡ **Optimized rendering with Next.js App Router**
- 🔴 **Live project showcase** — fetched from the GitHub API on every request (`src/app/api/projects/route.js`), including private repos when a `GITHUB_TOKEN` is configured
- 💾 **Persistent project approvals** via Vercel KV / Upstash Redis, with a local-file fallback for development (see `KV_SETUP.md`)
- 🔐 **Password-protected admin panel** (`/admin`) for approving projects and editing their descriptions/demo links, secured with a signed session cookie (`src/lib/adminAuth.js`)
- 📂 **"Load more" project pagination** with featured projects surfaced first
- 📩 **Contact form integration via Formspree**
- 🎨 **Clean, modern UI styled with Tailwind CSS and MUI**

---

## 🛠️ **Tech Stack**

- ⚛️ **React 19 / Next.js 16** — App Router, component-based frontend
- 🟦 **TypeScript-ready tooling** alongside JavaScript
- 🎨 **Tailwind CSS** + **MUI** — utility-first styling and component primitives
- 🎞️ **Framer Motion** — animation and transitions throughout the site
- 🐙 **GitHub REST API** — powers the live project feed
- 🗄️ **Vercel KV / Upstash Redis** (`@upstash/redis`) — persistent store for project approvals
- 🔐 **Custom HMAC-signed session auth** — no external auth provider, just Node's `crypto` (`src/lib/adminAuth.js`)
- 📬 **Formspree** — contact form handling

---

## 🧠 **Skills Represented in This Project**

### Frontend Development
- React.js, Next.js, TypeScript, JavaScript (ES6+)
- Responsive, component-based, single-page app architecture

### Styling & UI
- Tailwind CSS, MUI, Framer Motion
- Mobile-first, cross-browser design

### Backend / API Layer
- Next.js API routes (`src/app/api/*`)
- GitHub REST API integration with auth-token support for private repos
- Vercel KV / Upstash Redis for persistent server-side state
- Custom session auth (signed cookies, no third-party auth service)

### Tools & Platforms
- Git & GitHub, Vercel deployment, npm

---

## 🗂️ **Project Structure**

- 📦 `src/components` — Reusable UI components (project cards, skills grid, admin UI, etc.)
- 🧭 `src/app` — App Router pages and API routes (`api/projects`, `api/admin/*`, `admin`)
- 🗃️ `src/lib` — Server-side logic: approvals store (`approvedProjectsStore.js`), admin auth (`adminAuth.js`)
- 🎨 `src/constants` — Static content (skills grid data, etc.)
- 🖼️ `public` — Images and static assets

See `KV_SETUP.md` for how the persistent approvals store is configured.

---

## 📬 **Contact**

For collaboration, feedback, or professional opportunities, feel free to reach out via the contact form on the site.

---

## ✨ Thanks for taking the time to look through my portfolio project.
