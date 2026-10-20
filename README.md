# BookCreator.in — Kerala Local Creator Discovery Directory

> **"Book Vetted Local Creators. Zero Agency Fees."**  
> Fast, search-first local influencer discovery directory tailored for small businesses in Kerala (Thrissur, Kochi, Kozhikode, Trivandrum, and beyond).

---

## 🚀 Quick Start

You can run BookCreator.in in any browser either directly or via a local server:

### Option 1: Direct File Open
Double-click [`index.html`](file:///Users/macbookair/Developer/influencers/index.html) or open it directly in Safari, Chrome, Edge, or Brave:
```bash
open index.html
```

### Option 2: Local HTTP Server
Run the built-in static server:
```bash
npm start
# or
python3 -m http.server 3000
```
Then visit **`http://localhost:3000/`** in your browser.

---

## 🎯 Architecture & Features

### 1. Minimalist Dark Aesthetic
- **Color Palette**: Dark `#0B0F19` background, slate text (`#94A3B8`, `#CBD5E1`), subtle `#1E293B` borders, glassmorphic cards (`rgba(17, 24, 39, 0.85)` + `backdrop-filter: blur(16px)`).
- **PRO Golden Accents**: Amber/gold glow `#F59E0B` for paying creator listings with animated shimmer ribbons.
- **Mobile-First**: 100% responsive fluid grid (1 column on mobile, 2 columns on tablet, 3–4 columns on desktop), zero horizontal overflow, and minimum 48px touch targets on all interactive elements.

### 2. Priority Sorting Algorithm
1. **Tier 1 (PRO Pinned)**: Creators with `isPro: true` (paying ₹500/mo) are always pinned at the top.
2. **Tier 2 (Search Relevance)**: Creators matching keyword terms across name, handle, locality, tags, and bio.
3. **Tier 3 (Standard Listings)**: Free listings sorted below PRO listings by verified engagement and Reel views.

### 3. Scalable State & District Dictionary
- **Scalable Architecture**: Powered by `LOCATION_DATA` supporting current live states and future expansion:
  - **Kerala** (`active: true`): Full 14 districts (*Alappuzha, Ernakulam (Kochi), Idukki, Kannur, Kasaragod, Kollam, Kottayam, Kozhikode, Malappuram, Palakkad, Pathanamthitta, Thiruvananthapuram, Thrissur, Wayanad*).
  - **Karnataka** (`active: false`, marked "Coming Soon"): Bengaluru Urban, Mysuru, Mangaluru, Hubballi-Dharwad.
  - **Tamil Nadu** (`active: false`, marked "Coming Soon"): Chennai, Coimbatore, Madurai, Tiruchirappalli.
  - **Maharashtra** (`active: false`, marked "Coming Soon"): Mumbai, Pune, Nagpur, Nashik.
  - **Delhi NCR** (`active: false`, marked "Coming Soon"): New Delhi, Gurugram, Noida.
- **Dynamic Dropdown Cascade**:
  - `stateSelect` switches dynamically and repopulates `districtSelect` in 0ms without page reloads.
  - Coming Soon states show a dedicated expansion announcement card with early creator pre-registration.
  - Creator onboarding modal also uses the dynamic State & District cascade.

### 4. Client-Side Instant Filtering
- **State & District Selector**: `stateSelect` and `districtSelect` linked via `applyFilters()`.
- **Category / Niche Chips**: All, Food & Cafes, Salon & Beauty, Fashion, Tech & Autos, Fitness.
- **Budget Cap**: Any, Under ₹1,500, ₹1,500–₹3,000, ₹3,000–₹5,000, ₹5,000+.
- **Real-Time Keyword Search**: Instant live filtering with clear button and keyboard shortcut (`/` to search, `ESC` to dismiss modals).

### 4. Creator Cards & Direct Actions
- **Profile Details**: Avatar with initials fallback, verified checkmark, district + locality pill (`📍 Thrissur · Swaraj Round`), category tags, and bio.
- **Metrics Bar**: Followers (`28.4K`), Average Reel Views (`19.5K`), Engagement Rate (`5.8%`), and transparent pricing (`Starting at ₹1,800 / Reel visit`).
- **Direct Actions**:
  - `DM on Instagram` &rarr; Direct link to `https://instagram.com/{handle}` (target="_blank").
  - `WhatsApp Inquiry` &rarr; Direct link to `https://wa.me/{number}?text={encoded_pitch}`.
  - `Custom Collab Pitch` &rarr; 1-click pitch modal with English and Manglish templates.
  - `Bookmark` (Heart Icon) &rarr; Adds creator to the Campaign Shortlist drawer.

### 5. Creator Onboarding Modal ("Join as Creator" / `#joinModal`)
- **Navbar Trigger**: Primary CTA button (`#btnOpenJoinModal`) styled with high-contrast `bg-slate-900 text-white`.
- **Form Inputs**: Full Name / Brand Name, Instagram / YouTube Handle (`@username`), Primary District (14 Kerala districts), Primary Category, Base Rate per Reel/Shoot (`₹ 2,500`), WhatsApp Contact Number, Portfolio / Best Reel Link.
- **Automated WhatsApp Desk Message**: Compiles submission into a pre-formatted WhatsApp application payload for review.
- **Lead & Application Persistence**: Stored in `localStorage` under `bookcreator_applications`.
- **Instant Confirmation State**: Replaces form with success card: *"Application received! Our onboarding team will review your profile and reach out on WhatsApp within 24 hours."*

### 6. Dynamic URL-Synchronized Filtering
- **History API**: Seamlessly updates browser address bar with `window.history.replaceState` (e.g. `/?district=kochi&category=food&q=cafe`).
- **Campaign Landing Hydration**: On `DOMContentLoaded`, reads query parameters and pre-filters the directory.
- **Browser Navigation**: Supports Back/Forward navigation with `popstate` hydration.

### 7. Direct WhatsApp Inquiries & Lead Tracking
- **Personalized Template**: Generates custom conversation starter (`generateWhatsAppInquiryUrl`) with creator name and district.
- **Analytics & Tracking**: Tracks outbound WhatsApp leads in `localStorage` (`bookcreator_inquiry_leads`) with creator details and timestamps.

---

## 🌐 Production Deployment & SEO Assets

- **Crawler Directives**: [`robots.txt`](file:///Users/macbookair/Developer/influencers/robots.txt) configured with full indexing permissions and XML sitemap link.
- **Sitemap**: [`sitemap.xml`](file:///Users/macbookair/Developer/influencers/sitemap.xml) indexed with standard schema (`/`, `/privacy.html`, `/terms.html`).
- **Legal Compliance**:
  - [`privacy.html`](file:///Users/macbookair/Developer/influencers/privacy.html) — Privacy policy covering WhatsApp direct contact, creator data rights, and 0% commission data handling.
  - [`terms.html`](file:///Users/macbookair/Developer/influencers/terms.html) — Platform terms, disclaimers for independent off-platform commercial contracts, and jurisdiction (Kerala, India).
- **Deployment Configs**:
  - `vercel.json` (Vercel deployment headers, clean URLs, and static asset caching)
  - `_headers` (Cloudflare Pages security headers and asset caching)
  - `netlify.toml` (Netlify build publish directory and security headers)

