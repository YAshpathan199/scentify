<p align="center">
  <img src="public/favicon.svg" width="80" alt="Scentify Logo" />
</p>

<h1 align="center">Scentify</h1>

<p align="center">
  <strong>Your Personal Fragrance Advisor — Curated for the Indian Fragrance Lover</strong>
</p>

<p align="center">
  <a href="#features">Features</a> &nbsp;&bull;&nbsp;
  <a href="#live-demo">Live Demo</a> &nbsp;&bull;&nbsp;
  <a href="#tech-stack">Tech Stack</a> &nbsp;&bull;&nbsp;
  <a href="#getting-started">Getting Started</a> &nbsp;&bull;&nbsp;
  <a href="#fragrance-data">Fragrance Data</a> &nbsp;&bull;&nbsp;
  <a href="#recommendation-engine">Recommendation Engine</a> &nbsp;&bull;&nbsp;
  <a href="#pages--routes">Pages & Routes</a> &nbsp;&bull;&nbsp;
  <a href="#admin-panel">Admin Panel</a> &nbsp;&bull;&nbsp;
  <a href="#project-structure">Project Structure</a>
</p>

---

## What is Scentify?

Scentify is a full-featured, client-side Progressive Web App that helps you discover, learn about, and manage fragrances. It goes beyond a simple catalogue — it includes a weighted recommendation engine, an interactive spray calculator, a fragrance family classifier, a layering lab, and a complete learning hub, all tailored for the Indian climate, seasons, and occasions.

Everything runs in the browser. There is no backend — all data lives in `localStorage` and can be exported/imported as JSON.

---

## Live Demo

Deployed on **Cloudflare Pages** via Wrangler:

```
https://scentify.pages.dev
```

Installable as a **Progressive Web App** (PWA) — add to home screen on mobile for a fullscreen, app-like experience.

---

## Features

### Fragrance Discovery Quiz (`/discover`)
A step-by-step, animated quiz that guides you through four questions — **Season**, **Occasion**, **Time of Day**, and **Outfit** — and returns a ranked list of fragrances that match your preferences. Results update live as you answer. Each result card includes an expandable **"How to Wear"** spray guide personalised to the fragrance, selected season, and occasion. Supports gender filtering (All / Him / Her). The current season is auto-detected based on the Indian calendar.

### Quiz Results (`/results`)
After completing the quiz, see a detailed results page with **tier rankings** (S / A / B / C), a **notes pyramid** for each fragrance, human-readable **reasons** explaining why each fragrance was recommended ("Built for winter", "Projects through the crowd", "Lasts 8+ hours"), and a personalised spray guide. Includes a home spray results mode for room-based recommendations.

### Explore Collection (`/explore`)
Browse the full fragrance collection with:
- **Search** by name, brand, or notes
- **Filter** by fragrance family, concentration (EDT/EDP/Parfum), and gender
- **Sort** by name, rating, price, longevity, or date added
- **Scent DNA** — a visual bar chart showing your collection's distribution across all 15 fragrance families (click any bar to filter)
- **Favorites** — toggle favorites on any fragrance and filter to view only favorites
- **Collection stats** — total bottles, total value, average longevity, average rating

### Fragrance Detail (`/fragrance/:id`)
Full detail page for each fragrance:
- **3D tilt bottle viewer** with mouse-tracking parallax, glow effect, and drop shadow
- **Notes Pyramid** — visual top / heart / base note breakdown with pills
- **Performance stats** — longevity (hours), projection level (soft/moderate/strong/beast) with progress bars
- **Star rating** display
- **Occasion tags**, season tags, mood tags, and dress code tags
- **Description** and **ideal wearer** profile
- **Dynamic Spray Guide** personalised to the current season and occasion
- **Fragrantica community accords** when available (with vote-weighted blending)
- **Shop link** to buy
- **Similar fragrances** suggestions
- **Favorite toggle** (heart icon)

### Fragrance Families (`/families`)
An encyclopedia of all **15 fragrance families**:

| Family | Character |
|---|---|
| Floral | Romantic, elegant, soft — rose, jasmine, tuberose |
| Oriental | Rich, warm, exotic — vanilla, saffron, incense, oud |
| Woody | Earthy, grounding — sandalwood, cedarwood, vetiver |
| Fresh | Clean, crisp — mint, green apple, ozonic notes |
| Citrus | Bright, zesty — bergamot, lemon, orange, grapefruit |
| Aquatic | Oceanic, breezy — sea salt, ambroxan, marine accord |
| Aromatic | Herbal, sophisticated — lavender, geranium, rosemary |
| Fougere | Classic masculine — lavender, coumarin, oakmoss |
| Chypre | Mossy, refined — oakmoss, bergamot, labdanum |
| Spicy | Bold, warm — pepper, cinnamon, clove, tobacco |
| Gourmand | Sweet, edible — vanilla, coffee, cherry, praline |
| Green | Crisp, natural — galbanum, violet leaf, cucumber |
| Leather | Bold, smoky — birch tar, suede, smoky woods |
| Powdery | Soft, intimate — iris, violet, heliotrope |
| Musk | Skin-close, sensual — white musk, ambroxan, ambrette |

Each family page includes:
- Detailed description with Indian cultural context
- Key notes and ingredients
- Best seasons
- Fragrances from your collection that belong to this family
- **Layering & pairing rules** — which families pair well together, how to layer them, and what occasions they suit

### Spray Guide (`/guide`)
A comprehensive "How to Wear Your Fragrance" guide:
- **Interactive Spray Calculator** — select a fragrance and intensity level (Subtle / Moderate / Noticeable / Strong), get a personalised spray count adjusted for the current season, concentration, projection, longevity, and occasion type
- **SVG Body Map** — visual diagram highlighting active spray application points (wrists, neck, chest, behind ears, inner elbows, collar, scarf, sleeves)
- **Home Spray Guide** — select a room (Bedroom, Living Room, Kitchen, Bathroom, Pooja Room, Entrance) and time of day, get personalised spray recommendations including where to spray, which fragrance families work best, and tips
- **Tips Accordion** — Common Mistakes, Storage Tips, Seasonal Guide, Concentration Guide (EDC/EDT/EDP/Parfum with strength bars), and Occasion Intensity table

### Scent Scout (`/scout`)
A fragrance family classifier tool:
- **Paste Mode** — paste Fragrantica accord data (JSON) or a full fragrance object with notes, and the engine classifies it into its primary fragrance family with confidence percentages across all 15 families
- **Collection Mode** — select any fragrance from your collection to see its full family classification breakdown
- **Collection Coverage** — visual grid showing which of the 15 families your collection covers, how many bottles per family, and which families are missing

### Learn Hub (`/learn`)
A central learning hub linking to all educational content:
- Spray Guide, Fragrance Families, and Storage Tips cards with topic lists
- **Concentration explainer** — EDC (2-5% oil), EDT (5-15%), EDP (15-20%), Parfum (20-30%) with animated strength bars, longevity ranges, and recommended spray counts
- Quick Facts — number of fragrance families, Indian seasons, occasions, and concentration types

### Storage & Care (`/storage`)
Everything about protecting your collection:
- **The Three Enemies** — Heat, Light, and Humidity with detailed explanations
- **Do's & Don'ts** — 7 do's and 7 don'ts, including India-specific advice (AC room storage, silica gel packets, away from agarbatti/dhoop)
- **Indian Climate Storage Guide** — season-by-season advice for Summer (Apr-Jun), Monsoon (Jul-Sep), Winter (Dec-Feb), and Spring/Autumn
- **Shelf Life Guide** — how long each concentration type lasts when opened vs. sealed (EDC: 1-2 years opened, EDT: 2-3 years, EDP: 3-5 years, Parfum: 5+ years)
- **Expiry Signs** — color darkening, sour scent, top notes disappearing, corroded sprayer, cloudy liquid

### Home Page (`/`)
Landing page with:
- **Dark hero section** with animated particle field, floating sparkles, and a **3D perfume bottle** rendered with React Three Fiber (glass material with transmission, chromatic aberration, and scent particles)
- **How It Works** — 3-step flow (Pick Occasion, Get Matches, Wear Right)
- **Featured Collection** — curated fragrance highlights
- **CTA Section** — call-to-action to start the quiz

### Progressive Web App (PWA)
- Fullscreen display mode with portrait orientation lock
- Service worker for offline caching
- Installable on mobile (add to home screen)
- Custom favicon and PWA icon

---

## Fragrance Data

### The Collection

Scentify ships with **22 curated fragrances** across 8 brands, with detailed metadata for each:

| # | Fragrance | Brand | Family | Concentration | Gender | Size | Price |
|---|---|---|---|---|---|---|---|
| 1 | Hawas | Rasasi | Aquatic | EDP | Men | 100ml | ₹2,750 |
| 2 | Aventus Legacy | Cologne House | Chypre | EDP | Men | 50ml | ₹649 |
| 3 | Cool Rush | Cologne House | Aromatic | EDT | Men | 50ml | ₹649 |
| 4 | Tobacco Dreams | Cologne House | Oriental | EDP | Men | 50ml | ₹649 |
| 5 | Silent Storm | Ajmal | Citrus | EDP | Men | 100ml | ₹1,100 |
| 6 | Oud Nirvana | Ajmal | Oriental | EDP | Unisex | 30ml | ₹999 |
| 7 | White Oud | Ajmal | Floral | EDP | Unisex | 30ml | ₹999 |
| 8 | Oud on the Rocks | Ajmal | Gourmand | EDP | Unisex | 30ml | ₹999 |
| 9 | Aristocrat | Ajmal | Citrus | EDP | Men | 14ml | ₹999 |
| 10 | Black Tie | ArtiScents | Oriental | EDP | Men | 50ml | ₹999 |
| 11 | Modern Code | ArtiScents | Fougere | EDP | Men | 50ml | ₹999 |
| 12 | Wet Cherry | ArtiScents | Gourmand | EDP | Unisex | 50ml | ₹999 |
| 13 | Effortless Charm | ArtiScents | Citrus | EDP | Unisex | 50ml | ₹999 |
| 14 | Dive Club | Hira | Aquatic | EDP | Men | 50ml | ₹999 |
| 15 | Oak & Smoke | Hira | Woody | EDP | Men | 50ml | ₹999 |
| 16 | Daily Rizz | Sniiff Culture | Citrus | EDP | Men | 100ml | ₹1,299 |
| 17 | Arabian Desire | Sniiff Culture | Floral | EDP | Unisex | 100ml | ₹1,299 |
| 18 | Tobacco Mabkhar | Ibrahim Al Qurashi | Spicy | EDP | Men | 50ml | ₹6,500 |
| 19 | Atlas | Faunwalk | Fresh | Extrait | Unisex | 100ml | ₹1,749 |
| 20 | Radiance | Faunwalk | Floral | Extrait | Women | 3ml | ₹139 |
| 21 | Mocha | Faunwalk | Gourmand | Extrait | Women | 3ml | ₹139 |
| 22 | Royalty | Faunwalk | Oriental | Extrait | Women | 3ml | ₹139 |
| 23 | Runway | Faunwalk | Floral | Extrait | Women | 3ml | ₹139 |

### Data Per Fragrance

Each fragrance entry contains:

```js
{
  id: 'hawas',                        // Unique slug
  name: 'Hawas',                      // Display name
  brand: 'Rasasi',                    // Brand
  gender: 'men',                      // men | women | unisex
  concentration: 'EDP',              // EDC | EDT | EDP | Parfum | Extrait de Parfum
  family: 'aquatic',                 // One of 15 fragrance families
  image: '/images/hawas.svg',        // Bottle illustration (hand-drawn SVG)
  notes: {
    top: ['Apple', 'Bergamot', 'Lemon', 'Cinnamon'],
    heart: ['Watery Notes', 'Plum', 'Orange Blossom', 'Cardamom'],
    base: ['Ambergris', 'Musk', 'Patchouli', 'Driftwood'],
  },
  rating: 4,                         // 1-5 star rating
  occasions: ['friends-outing', 'club-nightlife', ...],  // Array of occasion IDs
  seasons: ['summer', 'spring'],     // Best seasons
  timeOfDay: ['afternoon', 'evening'],
  mood: ['confident', 'energetic'],
  dressCodes: ['smart-casual', 'casual'],
  longevity: 8,                      // Hours (1-10 scale)
  projection: 'strong',             // soft | moderate | strong | beast
  price: 2750,                       // INR
  size: '100ml',
  dateAdded: '2024-01-15',
  shopLink: 'https://...',           // Where to buy
  description: '...',                // Detailed scent description
  wearer: '...',                     // Ideal wearer profile
  fragranticaAccords: { ... },       // Community accord votes (optional)
  fragranticaVotes: 11796,           // Number of community votes (optional)
}
```

### Occasions (31 Total)

Organized into 6 categories:

| Category | Occasions |
|---|---|
| **Wedding & Functions** | Mehendi, Sangeet, Wedding Ceremony, Reception, Engagement |
| **Festivals** | Diwali, Holi, Eid, Navratri, Ganesh Chaturthi, Christmas & New Year, Pongal/Onam, Raksha Bandhan |
| **Professional** | Office, Interview, Business Meeting, Conference, Office Party |
| **Social & Casual** | Dinner Date, Friends Outing, Movie/Mall, House Party, Club/Nightlife, Brunch/Cafe |
| **Religious & Spiritual** | Temple Visit, Pooja at Home, Prayer Gathering |
| **Special Moments** | First Date, Anniversary, Birthday, Graduation, Airport/Travel |

Each occasion has an **intensity level** (light / moderate / heavy) that influences spray recommendations.

### Seasons (5 Indian Seasons)

| Season | Months | Climate | Fragrance Tip |
|---|---|---|---|
| Summer | Apr-Jun | Hot & dry | Go light — heat amplifies projection. Fresh, aquatic, and citrus families. |
| Monsoon | Jul-Sep | Humid & rainy | Spray on clothes — humidity affects longevity. Fresh and aromatic work best. |
| Autumn | Oct-Nov | Mild & pleasant | Any family works. Woody and aromatic shine. |
| Winter | Dec-Feb | Cool & dry | Best season for fragrance! Go generous with oriental, woody, and gourmand. |
| Spring | Feb-Mar | Warm & pleasant | Floral and aromatic are ideal. Standard application. |

### Fragrance Families (15)

Floral, Oriental, Woody, Fresh, Citrus, Aquatic, Aromatic, Fougere, Chypre, Spicy, Gourmand, Green, Leather, Powdery, Musk — each with a unique color, icon, description, and classification profile.

### Moods (5)

Confident, Romantic, Chill, Energetic, Elegant — each mapped to a heaviness target that influences the recommendation engine.

### Dress Codes (4)

Ethnic (kurta, sherwani, saree), Formal (suit, blazer), Smart Casual (chinos, polo), Casual (jeans, t-shirt) — each mapped to fragrance family affinities.

### Concentrations (4)

| Type | Oil % | Longevity | Base Sprays |
|---|---|---|---|
| EDC (Cologne) | 2-5% | 1-3 hours | 6 |
| EDT (Eau de Toilette) | 5-15% | 3-5 hours | 4 |
| EDP (Eau de Parfum) | 15-20% | 5-8 hours | 3 |
| Parfum | 20-30% | 8-12 hours | 2 |

### Layering & Pairing Rules (7)

Predefined pairing rules between fragrance families:

| Pair | Result | Best For | How to Layer |
|---|---|---|---|
| Woody + Fresh | Balanced outdoor scent | Casual outings, brunches | Fresh on skin (wrists), Woody on collar/chest |
| Oriental + Gourmand | Rich evening blend | Date nights, parties | Gourmand on skin (pulse points), Oriental on clothes |
| Aromatic + Citrus | Energizing daytime combo | Office, morning wear | Citrus on skin first, Aromatic on top after 1 min |
| Aquatic + Woody | Sophisticated summer scent | Summer evenings, travel | Aquatic on skin, Woody on collar/sleeves |
| Floral + Woody | Classic refined pairing | Weddings, formal events | Woody on skin base, Floral sprayed over after drying |
| Oriental + Woody | Powerful winter blend | Winter events, festivals | Woody on skin, Oriental on clothes and scarf |
| Fresh + Aromatic | Clean versatile layer | Office, interviews | Fresh on skin, Aromatic on collar |

### Home Spray Guide

Room-by-room, time-of-day spray recommendations for 6 rooms: Bedroom, Living Room/Hall, Kitchen & Dining, Bathroom, Pooja Room, Entrance/Foyer. Each combination specifies spray count, where to spray (pillows, curtains, cushions, etc.), recommended fragrance families, and a tip.

### Collection Gaps

The data also tracks **collection gaps** — fragrance profiles the collection is missing:
- Fresh-Oriental for summer parties
- Gourmand for winter festivities (Diwali, Christmas, Sangeet)

---

## Recommendation Engine

The recommendation engine is adapted from [almanac](https://github.com/davidbeck45/almanac) and uses **weighted multi-component scoring** with **accord-based matching**.

### How It Works

1. **Note-to-Accord Mapping** — Every fragrance note (e.g., "Bergamot") is mapped to one or more accord categories (e.g., `{ citrus: 0.8, fresh: 0.2 }`) with layer weighting (top: 1.0, heart: 0.8, base: 0.6)
2. **Fragrantica Blending** — When community accord data is available, it is blended with note-derived accords using a vote-count-weighted ratio (45-60% community weight)
3. **Heaviness Calculation** — Each fragrance gets a heaviness score from -1 (fresh/light) to +1 (heavy/warm), combining note-based accord weights with a family base heaviness fallback
4. **Multi-Component Scoring** — Seven scoring dimensions are calculated and weighted:

| Component | Weight | What It Measures |
|---|---|---|
| Season Fit | 25% | Tag match + heaviness alignment with season target |
| Occasion Fit | 25% | Tag match + accord profile match against occasion archetype |
| Time of Day | 12% | Tag match + heaviness alignment with time target |
| Weather Fit | 12% | Heaviness appropriateness for the season's climate (quadratic penalty for wrong-direction mismatches) |
| Performance | 10% | Longevity and projection vs. occasion expectations |
| Dress Code | 6% | Tag match + family affinity for the selected outfit |
| Mood | 5% | Tag match + heaviness alignment with mood target |
| Quality | 5% | Rating normalized to 0-1 |

5. **Rotation Penalty** — Recently worn fragrances get a decaying penalty (20% for same day, down to 0.5% for 9 days ago) to encourage variety
6. **Tier Assignment** — Fragrances are sorted by score and assigned to tiers: **S** (top 3), **A** (next 5), **B** (next 6), **C** (rest), with floor score enforcement
7. **Reason Generation** — Human-readable explanations are generated for each recommendation ("Built for summer", "Warm allure suits a date", "Projects through the crowd", "Fades early — carry a decant")

### Occasion Archetypes

The 31 occasions are mapped to 7 archetypes, each with a detailed accord profile:

| Archetype | Occasions | Preferred Accords | Avoided Accords |
|---|---|---|---|
| **Office** | Office, Interview, Business Meeting, Conference | Citrus, Fresh, Iris, Aromatic, Musky | Oud, Animalic, Sweet, Tobacco |
| **Date** | Dinner Date, First Date, Anniversary | Vanilla, Amber, Warm Spicy, Leather, Musky | Aquatic, Fresh, Green |
| **Night Out** | Club, House Party, Birthday, Sangeet, Navratri, Christmas | Sweet, Vanilla, Fruity, Warm Spicy, Cinnamon | Green, Earthy, Iris |
| **Formal** | Wedding, Reception, Engagement, Diwali, Eid, Graduation | Iris, Leather, Woody, Amber, Rose | Sweet, Tropical, Fruity |
| **Casual** | Friends Outing, Mall, Brunch, Pongal, Raksha Bandhan | Fresh Spicy, Citrus, Woody, Aromatic | Leather, Tobacco, Smoky, Oud |
| **Outdoors** | Airport/Travel, Holi | Citrus, Aquatic, Ozonic, Marine, Fresh | Amber, Vanilla, Leather, Oud |
| **Cozy** | Temple Visit, Pooja, Prayer Gathering | Vanilla, Powdery, Sweet, Amber, Musky | Citrus, Aquatic, Green, Fresh |

### Dynamic Spray Guide

The engine also generates a **dynamic spray guide** for each fragrance + context combination, adjusting spray count based on:
- Concentration (EDC/EDT/EDP/Parfum base)
- Season (heat reduces, cold increases)
- Heaviness vs. season alignment
- Projection strength (strong projectors need fewer sprays)
- Longevity (short-lived fragrances need more)
- Occasion archetype (office = fewer, nightout = more)

And determining spray placement (neck, chest, wrists, behind ears, collar, scarf) and surface (skin / clothes / both) based on the occasion, season, and fragrance weight.

### Fragrance Family Classifier

The Scent Scout page uses a separate classification engine:
- Maps accord profiles against **15 family accord profiles** (e.g., Floral = `{ rose: 1.0, white_floral: 1.0, floral: 0.9, iris: 0.7, violet: 0.6 }`)
- Calculates weighted match scores
- Returns confidence percentages for each family
- Accepts Fragrantica accord JSON, raw accord objects, or full fragrance objects with notes

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with 3D hero, particle field, how-it-works, and featured collection |
| `/discover` | Discover | Step-by-step quiz with live results (Season > Occasion > Time > Outfit) |
| `/results` | Results | Detailed quiz results with tier rankings, notes pyramids, spray guides |
| `/explore` | Explore | Full collection browser with search, filter, sort, Scent DNA chart, favorites |
| `/fragrance/:id` | Detail | Individual fragrance page with 3D bottle viewer, notes pyramid, performance stats |
| `/guide` | Guide | Spray calculator, body map, home spray guide, tips accordion |
| `/learn` | Learn | Learning hub linking to Spray Guide, Families, and Storage |
| `/families` | Families | Encyclopedia of all 15 fragrance families with pairings |
| `/scout` | Scent Scout | Fragrance family classifier (paste accords or pick from collection) |
| `/storage` | Storage | Storage & care guide for the Indian climate |
| `/admin/*` | Admin | Full admin panel (see below) |

---

## Admin Panel

Accessible at `/admin`, the admin panel has its own sidebar navigation and includes 6 sections:

### Overview (`/admin`)
Dashboard with collection stats — total fragrances, total wear entries, and quick-access navigation to all admin sections.

### Fragrance Manager (`/admin/fragrances`)
Full CRUD for fragrances:
- Add new fragrances with all fields (name, brand, gender, family, concentration, notes, occasions, seasons, rating, etc.)
- Edit existing fragrances
- Delete fragrances
- View all fragrances in a management list

### Analytics (`/admin/analytics`)
Collection analytics and insights — visual breakdowns of your fragrance collection by family, season coverage, occasion coverage, and more.

### Wear History (`/admin/history`)
Log and track when you wear each fragrance:
- Add wear entries with date, fragrance, occasion, and notes
- View chronological wear history
- Delete individual entries
- Used by the recommendation engine for rotation penalty

### Layering Lab (`/admin/layering`)
Experiment with fragrance layering:
- **Auto-suggested pairs** — the system analyzes all possible pairs in your collection, scores them based on shared notes, family pairing rules, and cross-family contrast, and surfaces the top 8
- **Manual comparison** — select any two fragrances and see their pairing score, shared notes, applicable pairing rules, and layering instructions

### Data Tools (`/admin/data`)
Import, export, and reset your data:
- **Export** — download your entire collection, wear history, settings, and favorites as a JSON file
- **Import** — upload a previously exported JSON backup (with drag-and-drop support)
- **Reset** — factory reset with confirmation (type "RESET" to confirm) — restores sample fragrances and clears all history

---

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| [React](https://react.dev/) | UI framework | 19 |
| [Vite](https://vite.dev/) | Build tool & dev server | 8 |
| [React Router](https://reactrouter.com/) | Client-side routing | 7 |
| [Tailwind CSS](https://tailwindcss.com/) | Utility classes | 4 |
| [DaisyUI](https://daisyui.com/) | Component library (steps, etc.) | 5 |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions | 14 |
| [Lucide React](https://lucide.dev/) | Icon library | Latest |
| [React Three Fiber](https://r3f.docs.pmnd.rs/) | 3D rendering (hero bottle) | 9 |
| [Three.js](https://threejs.org/) | 3D engine | 0.187 |
| [@react-three/drei](https://drei.docs.pmnd.rs/) | R3F helpers (Float, Environment, MeshTransmissionMaterial) | 10 |
| CSS Modules | Scoped component styles | — |
| [OxLint](https://oxc.rs/docs/guide/usage/linter.html) | Fast linter | Latest |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | Cloudflare Pages deployment | 4 |

### Design System

- **Font Display:** Playfair Display (serif)
- **Font Body:** Inter (sans-serif)
- **Accent Color:** `#A67C4E` (warm gold)
- **Background:** `#F5F0E8` (cream)
- **Dark Hero:** `#151210`
- All spacing, radii, shadows, and transitions are managed via CSS custom properties in `src/styles/design-tokens.css`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Installation

```bash
git clone https://github.com/YAshpathan199/scentify.git
cd scentify
npm install
```

### Development

```bash
npm run dev
```

Opens at **http://localhost:5173** with hot module replacement.

### Build

```bash
npm run build
```

Outputs production bundle to `dist/`.

### Preview (Cloudflare Pages locally)

```bash
npm run preview
```

Runs the production build locally via Wrangler.

### Deploy

```bash
npm run deploy
```

Deploys to Cloudflare Pages.

### Lint

```bash
npm run lint
```

Runs OxLint.

---

## Project Structure

```
scentify/
├── public/
│   ├── images/                  # Fragrance bottle SVG illustrations
│   ├── favicon.svg              # App favicon
│   ├── favicon.webp             # PWA icon (192x192)
│   ├── pwa-icon.svg             # PWA icon (scalable)
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── src/
│   ├── components/
│   │   ├── admin/               # Admin panel components
│   │   │   ├── Overview.jsx     # Dashboard overview
│   │   │   ├── FragranceManager.jsx  # CRUD for fragrances
│   │   │   ├── Analytics.jsx    # Collection analytics
│   │   │   ├── WearHistory.jsx  # Wear logging & history
│   │   │   ├── LayeringLab.jsx  # Fragrance pairing experiments
│   │   │   └── DataTools.jsx    # Export, import, reset
│   │   ├── fragrance/
│   │   │   ├── FragranceCard.jsx     # Reusable fragrance card
│   │   │   ├── NotesPyramid.jsx      # Top/heart/base visual pyramid
│   │   │   └── SprayGuidePanel.jsx   # Spray guide display component
│   │   ├── home/
│   │   │   ├── Hero.jsx              # Dark hero with particles & 3D bottle
│   │   │   ├── PerfumeBottle3D.jsx   # Three.js glass bottle with scent particles
│   │   │   ├── HowItWorks.jsx        # 3-step flow section
│   │   │   ├── FeaturedCollection.jsx # Featured fragrance highlights
│   │   │   └── CTASection.jsx        # Call-to-action
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Responsive navbar (transparent on hero)
│   │   │   ├── Footer.jsx            # Site footer
│   │   │   └── ScrollToTop.jsx       # Scroll restoration on route change
│   │   └── ui/
│   │       ├── Button.jsx            # Reusable button
│   │       ├── Card.jsx              # Reusable card
│   │       ├── Badge.jsx             # Tag/badge component
│   │       ├── ProgressBar.jsx       # Animated progress bar
│   │       ├── StarRating.jsx        # Star rating display
│   │       ├── Section.jsx           # Page section wrapper
│   │       ├── ScrollReveal.jsx      # Intersection Observer reveal
│   │       ├── ParticleField.jsx     # Canvas particle animation
│   │       └── ScentifyMark.jsx      # Logo mark component
│   ├── context/
│   │   └── FragranceContext.jsx  # Global state (useReducer + localStorage)
│   ├── data/
│   │   ├── fragrances.js        # 22 curated fragrances + collection gaps
│   │   └── constants.js         # Occasions, seasons, families, moods, dress codes,
│   │                            # concentrations, spray guide, pairing rules,
│   │                            # home rooms, home spray guide, occasion intensity
│   ├── hooks/
│   │   └── use3DTilt.js         # Mouse-tracking 3D tilt + glare effect hook
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Discover.jsx         # Step-by-step quiz
│   │   ├── Results.jsx          # Quiz results with tiers
│   │   ├── Explore.jsx          # Collection browser with Scent DNA
│   │   ├── Detail.jsx           # Individual fragrance detail
│   │   ├── Guide.jsx            # Spray guide + home spray guide
│   │   ├── Learn.jsx            # Learning hub
│   │   ├── Families.jsx         # Fragrance families encyclopedia
│   │   ├── BuyAssist.jsx        # Scent Scout classifier
│   │   ├── Storage.jsx          # Storage & care guide
│   │   └── Admin.jsx            # Admin panel shell with sidebar
│   ├── styles/
│   │   ├── design-tokens.css    # CSS custom properties (colors, spacing, fonts)
│   │   └── global.css           # Global styles & Tailwind imports
│   └── utils/
│       ├── engine.js            # Recommendation engine (rank, discoverScore, dynamicSprayGuide)
│       ├── scoring.js           # Quiz scoring wrapper (calculateQuizScores, calculateOccasionScores)
│       ├── accords.js           # Note-to-accord mapping, heaviness calculation, Fragrantica blending
│       ├── classify.js          # Fragrance family classifier (classifyFamily, classifyFromNotes)
│       ├── sprayGuide.js        # Spray guide helpers (getSprayGuide, getSprayGuideForFragrance)
│       └── helpers.js           # getCurrentSeason, getGreeting, formatPrice, generateId
├── index.html                   # Entry point
├── vite.config.js               # Vite config (React + Tailwind plugins)
├── wrangler.jsonc               # Cloudflare Pages config (SPA routing)
├── package.json
└── package-lock.json
```

---

## State Management

Scentify uses **React Context + useReducer** with `localStorage` persistence. No external state library.

### Actions

| Action | Description |
|---|---|
| `ADD_FRAGRANCE` | Add a new custom fragrance (auto-generates ID and dateAdded) |
| `UPDATE_FRAGRANCE` | Update an existing fragrance by ID |
| `DELETE_FRAGRANCE` | Remove a fragrance by ID |
| `LOG_WEAR` | Log a wear entry (date, fragrance ID, occasion, notes) |
| `DELETE_WEAR` | Delete a wear entry by timestamp |
| `TOGGLE_FAVORITE` | Toggle favorite status for a fragrance |
| `IMPORT_DATA` | Bulk import fragrances, history, settings, and favorites |
| `RESET_DATA` | Factory reset to sample fragrances |
| `UPDATE_SETTINGS` | Update app settings |

### Storage Keys

| Key | Data |
|---|---|
| `scentify_fragrances` | Full fragrance collection (sample + custom) |
| `scentify_history` | Wear history entries |
| `scentify_settings` | App settings (onboarding state, etc.) |
| `scentify_favorites` | Array of favorite fragrance IDs |

Sample fragrances are always kept up to date — on load, the app merges the latest sample data with any custom (user-added) fragrances from localStorage.

---

## Utility Modules

### `accords.js` — Accord Engine
- **NOTE_TO_ACCORDS** — Maps 60+ fragrance notes to accord categories with weights
- **ACCORD_WEIGHTS** — Heaviness values for 40+ accords (-1 fresh to +1 heavy)
- **FAMILY_BASE_HEAVINESS** — Fallback heaviness per family (oriental: 0.7, aquatic: -0.9, etc.)
- `noteAccords(fragrance)` — Computes a fragrance's accord profile from its notes, blended with Fragrantica community data when available
- `heaviness(fragrance)` — Returns a single -1 to +1 heaviness score
- `accordFit(fragrance, profile)` — Scores how well a fragrance matches an occasion's accord profile

### `engine.js` — Recommendation Engine
- `rank(fragrances, answers, opts)` — Main ranking function returning scored, tiered, and reasoned results
- `discoverScore(frag, filters)` — Multi-filter scoring for the Discover page
- `dynamicSprayGuide(frag, season, occasion, concentration)` — Context-aware spray guide generation

### `scoring.js` — Quiz Scoring
- `calculateQuizScores(fragrances, answers, opts)` — Wraps `rank()` for the quiz, returning percentages and reason strings
- `calculateOccasionScores(fragrances, occasionId, currentSeason)` — Quick occasion-based ranking

### `classify.js` — Family Classifier
- `classifyFamily(accords)` — Classifies accords against 15 family profiles with confidence scores
- `classifyFromNotes(notesObj)` — Classifies from a notes object (top/heart/base)
- `classifyFromFragranticaAccords(fragranticaAccords)` — Classifies from Fragrantica accord data
- `parseInputJSON(text)` — Parses raw JSON input (accords, Fragrantica data, or full fragrance objects)

### `sprayGuide.js` — Spray Guide Helpers
- `getSprayGuide(season, occasion, concentration)` — Generic spray guide for a given context
- `getSprayGuideForFragrance(fragrance, season, occasion)` — Fragrance-specific spray guide
- `getSprayGuideByIntensity(season, intensity, concentration, bonus)` — Intensity-based spray guide for the Guide page

### `helpers.js` — General Utilities
- `getCurrentSeason()` — Returns current Indian season based on month
- `getGreeting()` — Returns time-based greeting (Good morning/afternoon/evening/night)
- `formatPrice(price)` — Formats price in INR (₹)
- `getProjectionPercent(projection)` — Converts projection level to percentage
- `generateId()` — Generates a unique ID

### `use3DTilt.js` — 3D Tilt Hook
Mouse-tracking hook that applies perspective-based 3D rotation and a directional glare effect to any element. Used on fragrance cards and the bottle viewer.

---

## Built for India

Scentify is designed specifically for the Indian fragrance market and climate:

- **31 occasions** including Indian weddings (Mehendi, Sangeet, Reception), festivals (Diwali, Holi, Eid, Navratri, Ganesh Chaturthi, Pongal/Onam, Raksha Bandhan), and religious events (Temple Visit, Pooja at Home, Prayer Gathering)
- **5 Indian seasons** with month mappings (Summer, Monsoon, Autumn, Winter, Spring) instead of the standard 4
- **Indian climate storage advice** — AC room storage, silica gel packets for monsoon, keep away from agarbatti/dhoop
- **Curated for the Indian market** — brands like Rasasi, Ajmal, Cologne House, ArtiScents, Hira, Sniiff Culture, and Ibrahim Al Qurashi, priced in INR
- **Home spray guide** includes a Pooja Room with tips for pairing with agarbatti, camphor, and ghee diya
- **Cultural dress codes** — Ethnic (kurta, sherwani, saree) alongside Formal, Smart Casual, and Casual
- **Locale** — `en-IN` throughout, INR currency formatting

---

## License

This project is for personal and educational use.

---

<p align="center">Crafted with care for fragrance lovers</p>
