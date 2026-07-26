# Sanjay Makwana — Portfolio

A premium, responsive personal portfolio for a .NET Full Stack Developer, built with
plain HTML5, CSS3 and vanilla JavaScript — no frameworks, no build step.

## Structure

```
portfolio/
├── index.html
├── css/
│   ├── style.css        # tokens, layout, components
│   ├── animations.css   # keyframes, scroll-reveal states
│   └── responsive.css   # breakpoints (mobile → ultra-wide)
├── js/
│   ├── theme.js         # dark/light theme + circular reveal transition
│   ├── animation.js     # loader, typing effect, counters, reveal, canvas
│   └── script.js        # navbar, mobile nav, modal, contact form
├── assets/
│   ├── images/          # profile / OG image
│   ├── icons/
│   └── resume.pdf
├── robots.txt
├── sitemap.xml
└── README.md
```

## Features

- Dark & light themes with a Telegram-style circular reveal transition, persisted in `localStorage`
- Sticky, blurring navbar with scroll-spy active states and a mobile hamburger menu
- Hero with typing effect and an interactive dot-grid canvas background
- Scroll-triggered reveal animations (Intersection Observer), animated counters and skill bars
- Project cards with a details modal, magnetic buttons, ripple clicks and cursor glow
- Fully responsive from mobile through ultra-wide screens, with `prefers-reduced-motion` support
- SEO: meta tags, Open Graph, Twitter Cards, JSON-LD `Person` schema, `robots.txt`, `sitemap.xml`

All content (experience, projects, skills, education, contact details) is sourced directly
from the resume — nothing is invented.

## Running locally

No build tools required — just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server
```

## Deployment

Static files only — deploy as-is to **GitHub Pages**, **Netlify**, or **Vercel**.
Before going live, update the placeholder URLs (`sanjaymakwana.dev`), social links
(GitHub/LinkedIn), and swap `assets/images/og-cover.png` / the profile placeholder
with real images if desired.
