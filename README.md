# WhatsCookin 🍳

A modern, mobile-first shared cookbook and kitchen management application designed for efficiency. WhatsCookin allows you and your partner to instantly save recipes, scratch off ingredients in real-time, and view an immersive "Cook Mode" that keeps your screen awake while your hands are covered in flour.

### ✨ Features
- **URL Recipe Scraper:** Paste a link from any popular food blog, and our scraper will automatically parse the structured JSON-LD data to instantly populate your cookbook.
- **"Cook Mode" Overlay:** A distraction-free, large-typography view that locks your screen awake using the Screen Wake Lock API. 
- **Realtime Shopping List:** A shared grocery list powered by Supabase Realtime. When someone crosses milk off at the store, it vanishes from your screen instantly. 
- **The "Surprise Me" Randomizer:** Can't decide what's for dinner? Use the randomizer to pull a quick suggestion from your library.
- **Notion-Style Aesthetic:** A beautifully minimal, monochrome UI layout built cleanly with Tailwind CSS.

### 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Storage, Realtime, SSR)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

To run the application locally, you will need to link it to a Supabase project.

### 1. Database Setup
1. Create a new [Supabase](https://database.supabase.com) project.
2. In your Supabase Dashboard SQL Editor, run the schema migration found in `implementation_plan.md` to format your tables and RLS policies.
3. In **Storage**, create a new bucket named `recipe-images` and toggle it to **Public**.
4. In **Database -> Replication**, enable replication for the `recipes` and `shopping_list` tables.

### 2. Environment Variables
Create a `.env.local` file in the root of the directory and populate it with your Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Start Cooking
Install dependencies and run the Next.js development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
*Built as a shared utility to keep the kitchen organized.*
