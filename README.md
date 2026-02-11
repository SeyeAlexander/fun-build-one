# ❤️ True Love — Valentine's Day

A handcrafted, interactive Valentine's Day love letter experience built with Next.js. Featuring a custom cursor, immersive music, variable-font typography, and a sealed envelope reveal.

> **Live:** [love.seyealexander.dev](https://love.seyealexander.dev)

---

## ✨ Features

- **Rotating Hero Text** — 9 pet-name phrases cycle with staggered 3D flip animations
- **Variable Font Interaction** — mouse movement morphs Fraunces font weight & softness in real-time (desktop only, RAF-lerped for smoothness)
- **Global Music** — Lim Kim's "Confess To You" auto-plays, persists across page navigation, with volume ducking on hover/click
- **Play/Pause Marquee** — scrolling song name in the header doubles as a music toggle
- **"Be My Val?" Prompt** — heart-shaped Yes button grows with each "No"; 3rd No triggers a banner & redirect
- **Sealed Envelope** — red envelope with "Mon Cœur" text; click to peek, click again to read
- **Love Letter** — poetic letter starting with "Ife mi" that fades in paragraph by paragraph
- **Floating Hearts** — heart icons rise from both sides 5 seconds after the letter opens
- **Crystal Snowflakes** — 6-pointed snowflake shapes fall with rotation and glow; fade when the letter is open
- **Confetti Burst** — canvas-confetti explodes when "Yes" is clicked
- **Paper Grain Texture** — subtle overlay for a tactile, stationery feel
- **Custom Cursor** — themed cursor across the experience

## 🛠 Tech Stack

| Layer     | Tech                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router)                                                  |
| Language  | TypeScript                                                                                     |
| Styling   | Tailwind CSS v4                                                                                |
| Animation | Framer Motion                                                                                  |
| Audio     | Howler.js                                                                                      |
| Font      | [Fraunces](https://fonts.google.com/specimen/Fraunces) (variable, self-hosted via `next/font`) |
| Confetti  | canvas-confetti                                                                                |
| Deploy    | Vercel                                                                                         |

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (font, music provider, cursor)
│   ├── page.tsx            # Landing — rotating hero, val prompt, CTA
│   ├── letter/page.tsx     # Envelope → letter reveal
│   ├── globals.css         # Design tokens, paper texture, marquee keyframes
│   └── icon.svg            # Heart favicon
├── components/
│   ├── music-provider.tsx  # Global music context (autoplay, ducking, fades)
│   ├── music-marquee.tsx   # Scrolling song name / play-pause toggle
│   ├── page-header.tsx     # Shared header (Feb. 14, marquee, CTA)
│   ├── rotating-hero.tsx   # Cycling phrases with flip animation
│   ├── val-prompt.tsx      # "Be my Val?" with growing SVG heart
│   ├── snowflakes.tsx      # Canvas — 6-pointed crystal snowflakes
│   ├── floating-hearts.tsx # Canvas — rising heart icons
│   ├── texture-overlay.tsx # Paper grain overlay
│   └── custom-cursor.tsx   # Custom themed cursor
├── hooks/
│   └── useSounds.ts        # Tap/switch sound effects
└── public/
    └── music/confess.mp3   # Background song
```

## 📄 License

Private — built with love by [Seye Alexander](https://seyealexander.dev).
