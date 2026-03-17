# Purina ONE Mini Dog Food Advisor

## Project Overview
Interactive web app that recommends Purina ONE Mini dog food products based on a personalized questionnaire. Built for a university presentation to Purina stakeholders.

**Live URL:** https://purina-one-advisor.vercel.app/
**GitHub:** MatteoRose/purina-one-advisor
**QR Codes:** `~/Desktop/purina-qrcode.png` (red) and `purina-qrcode-standard.png` (B&W)

## Tech Stack
- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4 with custom `@theme` variables in globals.css
- **Animations:** Framer Motion 12.36 (AnimatePresence, motion.div, spring transitions)
- **State:** Zustand 5.0.11 (single store: profile, cart, locale, theme, step)
- **i18n:** Custom hook `useTranslation()` with EN/IT, `interpolate()` for template vars
- **Deployment:** Vercel (auto-deploy from GitHub push)

## Architecture
```
src/
├── app/           # Routes: /, /questionnaire, /results, /cart, /confirmation
├── components/
│   ├── cart/      # AddToCartFeedback, CartItemRow
│   ├── hero/      # HeroSection (landing page)
│   ├── layout/    # ClientShell, Header, Footer, BackgroundEffects, ProgressBar
│   ├── questionnaire/  # LifestageStep, ActivityStep, HealthStep, WeightStep, NutritionTip, etc.
│   ├── results/   # MainProductCard, MiniProductCard, MatchScoreBadge, WhyWeRecommend, etc.
│   └── ui/        # FlagIcon (SVG flags for lang switcher)
├── i18n/          # config.ts, en.ts, it.ts
├── lib/           # recommendation.ts (scoring), products.ts (DB), dosage.ts, tips.ts
├── stores/        # useAdvisorStore.ts (Zustand)
└── types/         # index.ts (DogProfile, ScoredRecommendation, etc.)
```

## Key Patterns
- **Client/Server separation:** `ClientShell` wraps all pages with BackgroundEffects, Header, Footer, AddToCartFeedback
- **Scroll-to-top:** Auto-scrolls on route change via `usePathname()` in ClientShell
- **Mobile-first responsive:** All components use `text-sm sm:text-base` pattern with Tailwind breakpoints
- **Touch feedback:** `active:scale-[0.97]` on interactive elements
- **SVG score ring:** Animated `strokeDashoffset` in MatchScoreBadge
- **Shake animation:** Empty name submit triggers CSS shake + input focus
- **Print styles:** `@media print` with `.no-print` class, custom `@page` rules

## Brand & Design
- **Primary color:** Purina Red `#E91C24` (hover: `#C0161D`)
- **Dark theme (default):** `#111111` bg, `#1E1E1E` cards, `#404040` borders
- **Light theme:** Toggle available, `#F7F7F8` bg, `#FFFFFF` cards
- **Font:** Inter / Segoe UI / system-ui
- **Background:** Multi-layer radial gradients in BackgroundEffects component
- **PWA:** manifest.json, favicon.svg (red "P"), apple-web-app capable

## User Preferences
- Dark mode as default (with toggle to switch)
- Mobile-first — presentation audience will use phones via QR code
- Italian + English support
- Professional/polished look for Purina stakeholders
- All product images use `object-contain`

## Dev Commands
```bash
cd "C:\Users\matte\Desktop\Purina App\purina-advisor-final"
npm run dev          # Starts on port 3000 (or 3003 via launch.json)
npm run build        # Production build
```

## Deployment
```bash
git add -A && git commit -m "message" && git push
# Vercel auto-deploys from main branch
```

## Known Issues / Gotchas
- Turbopack crashes if `.next` cache from a different project copy is present → `rm -rf .next`
- Preview server needs restart after clearing `.next`
- Range slider styling uses vendor-specific pseudo-elements (webkit/moz)
- QR code CLI color flags may not render correctly in all viewers
