# ✨ Scentify

**Your personal fragrance advisor — curated for the Indian fragrance lover.**

Scentify helps you discover the perfect perfume for every occasion, season, and mood. Take a smart quiz, browse a curated collection, learn how to wear and store fragrances, and explore all 8 fragrance families — all in one place.

---

## 🖼️ Preview

| Home | Explore | Fragrance Families |
|---|---|---|
| Dark hero with particle field | Filter & browse collection | All 8 families with pairings |

---

## 🚀 Features

- **Fragrance Quiz** — Answer a few questions about your occasion, season, mood, and dress code to get a personalised recommendation
- **Browse Collection** — Filter 12 curated fragrances by family, season, occasion, and projection
- **Fragrance Detail** — Full notes pyramid (top / heart / base), ratings, wear tips, and similar picks
- **Fragrance Families** — Deep-dive into all 8 families (Woody, Floral, Oriental, Fresh, Citrus, Gourmand, Aromatic, Aquatic) with key notes, best seasons, and layering pairs
- **Spray Guide** — Interactive spray calculator, body-map application points, and season-specific advice for the Indian climate
- **Storage Tips** — The Three Enemies (heat, light, humidity), do's & don'ts, Indian climate seasonal guide, and shelf-life chart
- **Learn Hub** — Central hub linking to all learning resources
- **Admin Panel** — Overview, fragrance manager, wear history, layering lab, analytics, and data tools

---

## 🗂️ Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/discover` | Fragrance Quiz |
| `/results` | Quiz Results |
| `/explore` | Browse Collection |
| `/fragrance/:id` | Fragrance Detail |
| `/guide` | Spray Guide |
| `/learn` | Learn Hub |
| `/families` | Fragrance Families |
| `/storage` | Storage Tips |
| `/admin` | Admin Panel |

---

## 🛠️ Tech Stack

| Tool | Version |
|---|---|
| [React](https://react.dev/) | 19 |
| [Vite](https://vite.dev/) | 8 |
| [React Router](https://reactrouter.com/) | v7 |
| [Framer Motion](https://www.framer.com/motion/) | 14 |
| [Lucide React](https://lucide.dev/) | Latest |
| CSS Modules | — |

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YAshpathan199/scentify.git

# 2. Go into the folder
cd scentify

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Other Commands

```bash
npm run build    # Build for production (output goes to /dist)
npm run preview  # Preview the production build locally
npm run lint     # Run oxlint
```

---

## 📁 Project Structure

```
scentify/
├── public/
│   └── images/          # Fragrance bottle SVGs
├── src/
│   ├── components/
│   │   ├── admin/       # Admin panel components
│   │   ├── fragrance/   # FragranceCard, NotesPyramid
│   │   ├── home/        # Hero, FeaturedCollection, HowItWorks, CTASection
│   │   ├── layout/      # Navbar, Footer, ScrollToTop
│   │   └── ui/          # Button, Card, Badge, ProgressBar, StarRating, etc.
│   ├── context/         # FragranceContext (global state)
│   ├── data/
│   │   ├── fragrances.js  # 12 curated fragrances
│   │   └── constants.js   # Occasions, seasons, families, pairing rules
│   ├── hooks/           # use3DTilt
│   ├── pages/           # All page components
│   ├── styles/
│   │   ├── design-tokens.css  # CSS custom properties
│   │   └── global.css
│   └── utils/           # helpers, scoring, sprayGuide
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Design System

- **Font Display:** Playfair Display (serif)
- **Font Body:** Inter (sans-serif)
- **Accent:** `#A67C4E` (warm gold)
- **Background:** `#F5F0E8` (cream)
- **Dark Mode Hero:** `#151210`
- All spacing, radii, shadows, and transitions are managed via CSS custom properties in `src/styles/design-tokens.css`

---

## 🌏 Built for India

- 31 occasions including Indian festivals (Diwali, Holi, Eid, Navratri, Mehendi, Sangeet...)
- 5 Indian seasons (Summer, Monsoon, Autumn, Winter, Spring)
- Storage advice tailored for India's heat, humidity, and monsoon
- Fragrances curated for the Indian market (Rasasi, affordable alternatives, etc.)

---

## 📄 License

This project is for personal and educational use.

---

<p align="center">Crafted with ❤️ for fragrance lovers</p>
