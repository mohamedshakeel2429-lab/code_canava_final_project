# FINVERSE AI — Start Guide

## Port Configuration
* **Frontend Port:** `http://localhost:3000` (Configured in `vite.config.js`; can also run on any port e.g. `$env:PORT=5180; npm run dev`)
* **Backend API Port:** `http://localhost:8000` (`http://localhost:8000/api/v1/`)

---

## 1. Start Backend (Terminal 1)
```powershell
cd "c:\Users\mrsal\OneDrive\Desktop\New folder (3)\finverse-backend"
python manage.py runserver 8000
```
*Note: Your `GROQ_API_KEY` in `.env` is loaded automatically by Django for live AI assistant responses.*

---

## 2. Start Frontend (Terminal 2)
```powershell
cd "c:\Users\mrsal\OneDrive\Desktop\New folder (3)\finverse-frontend"
npm run dev
```

Open in your browser:
👉 **`http://localhost:3000`**

---

## Navigation Routes
* `/dashboard` — Overview & Health Metrics
* `/assistant` (or `/ai`) — AI Finance Assistant (Fixed & Bulletproof)
* `/avatar` — 3D Financial Avatar & 4-Stage Progression
* `/transactions` — Live Financial Transactions (Add, Edit, Delete, Filter)
* `/insights` — Spending Intelligence & Categorization
* `/goals` — Financial Goals & Milestone Tracking
* `/settings` — Preferences & Settings
