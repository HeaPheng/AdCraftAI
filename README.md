# AdCraft AI — High-Converting Marketing Copy Generator

AdCraft AI is a commercial-grade, bilingual AI SaaS platform designed to generate high-converting ad copy, landing page headlines, and social posts across 7 channels in seconds. Powered by Google Gemini with a resilient multi-model fallback rollover engine, the application offers native English and Khmer interface support with optimized typography.

---

## 🚀 Key Features

* **Multi-Platform Suite Generation**: Instantly craft tailored copywriting for Facebook Ads, Instagram Captions, TikTok Hooks, LinkedIn Sponsored Posts, X (Twitter) Posts, and Google SEO Meta descriptions/keywords.
* **Resilient AI Rollover Engine**: Automatically recovers from API rate limits or regional outages by cycling through backup models (Gemini 2.5 Flash Lite → Flash → Pro → 2.0 Flash) with exponential backoff.
* **Bilingual i18n & Font Matching**: Toggles seamlessly between English and Khmer. Dynamically loads the native Google Hanuman serif font family when Khmer is selected.
* **AI-Powered Product Suggestions**: Auto-fill product categories, target audiences, key benefit bullets, and default writing tones starting from only a product name.
* **Local Workspace Persistence**: Complete session-based guest trials, user account creation, credentials database, and campaign history logs stored locally in browser `localStorage` for privacy and zero DB server latency.
* **Accessible and Premium UI**: Built with modern accessibility guidelines, custom theme selectors, keyboard navigability, responsive mobile sidebar layouts, and a clean stateful notification center.

---

## 🛠️ Technology Stack

* **Framework**: React 19 + Next.js 15 (App Router, Server Components)
* **Styling**: Tailwind CSS v4 (Sleek dark modes, HSL variables, glassmorphic filters)
* **AI SDK**: `@google/generative-ai`
* **Components**: `@base-ui/react` primitives (Stateful dropdowns, triggers)
* **Forms & Verification**: `react-hook-form` + `zod` for robust client validation
* **Icons & Animation**: `lucide-react` + `framer-motion` for micro-interactions

---

## 📂 Architecture & Folder Structure

```
AI-Generate-TextAds/
├── app/                      # Next.js App Router (Page views & Layouts)
│   ├── api/                  # Serverless API routes (AI processing, Suggestion proxy)
│   ├── dashboard/            # Authenticated workspace paths (Generate, History, Profile, Settings)
│   ├── login/                # Session login views
│   ├── register/             # User register views
│   └── globals.css           # Custom tailwind configuration & global style variables
├── components/               # Reusable UI component catalog
│   ├── landing/              # Home landing page sections (Pricing, Features, FAQ, How It Works)
│   ├── layout/               # Shell wrappers (Bilingual Navbar, Sidebar, Footer, Language Switcher)
│   ├── marketing/            # Core feature components (Product Form, Results Dashboard)
│   └── ui/                   # Low-level UI primitives (Card, Badge, Button, Modal, Tooltip)
├── context/                  # Global Context providers (AuthContext, LanguageContext)
├── locales/                  # Global i18n translation key-value mappings (en.ts, km.ts)
├── services/                 # Business logic, Gemini prompt engineering, and mock API wrappers
├── types/                    # Shared TypeScript interface models (Product Form, Generation schema)
└── lib/                      # Core utility wrappers & prompt compilers
```

---

## ⚙️ Installation & Configuration

### Prerequisites
* Node.js v18.17.0 or higher
* npm or yarn

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/your-username/adcraft-ai.git
cd adcraft-ai
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your credentials in `.env.local`:
```env
# Google Gemini API Key (Get yours at: https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Google OAuth Client ID (Optional, for real Gmail sign-ins)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🏃 Running Locally

To start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Building for Production
Verify typescript compilation and build the static bundle:
```bash
npm run build
npm run start
```

---

## 🔒 Security & Performance Features

* **Client-Side Secrets**: Gemini keys can be configured server-side in API routes, isolating sensitive configuration from client bundles.
* **No Database Storage**: Generation history, user sessions, and campaign records are managed on-device inside client-side local database engines, maximizing speed and privacy.
* **Pluralization & Locale Fallback**: Deep translation dictionary with safe type definitions and English translation fallbacks for resilient localized renderings.
