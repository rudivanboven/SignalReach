# SignalReach - continuation prompt for Claude / VS Code

You are continuing an existing Next.js App Router project called **SignalReach**. Do not redesign from scratch unless requested. Preserve the current visual language and architecture.

## Brand and visual direction

- Premium website audit / QA / conversion service.
- Main palette: deep navy, warm gold, white/off-white, with selective cyan/green accents.
- Logo concept: website/browser window + growth/reach arrow.
- Headings use **Manrope** (`--font-heading`). Sizes/weights/tracking come only from the `--h*` tokens in `globals.css`.
- Paragraph/body copy and forms use **Inter** (`--font-body`).
- Buttons, menus, links and UI labels use **DM Sans** (`--font-ui`).
- Avoid Tailwind. Use CSS Modules.
- Keep all H1-H6, paragraph sizes, body colors, buttons and layout tokens globally controlled from `src/app/globals.css`.

## UX direction

- Sticky premium glass-style header.
- Strong modern hero section.
- Hero must have responsive mouse-follow / pointer-reactive animation and scanning visual.
- Use tasteful motion throughout: reveal-on-scroll, animated counters, line/path animation, hover lifts, scanning beams, floating particles, marquee technology logos/text, subtle glows.
- Motion must feel premium and intentional, not childish or distracting.
- Fully responsive from mobile through large desktop.

## Site pages

1. Home
2. How It Works
3. Services
4. About
5. Free Website Report

## Home sections

- Hero
- Animated audit stats
- What We Review / What We Provide
- How It Works
- Audit preview / sample findings
- Technology stack
- Why SignalReach / trust
- Final CTA

## Free Report page

Use a 40% / 60% layout on desktop:
- Left: headline, benefits, audit inclusions, trust text, delivery message.
- Right: premium form card.
- Fields: Full Name, Business Email, Company Name, Website URL, Industry, Main Goal, Biggest Website Challenges.
- CTA: `Send My Free Website Report`.
- Secondary CTA: `Book a 15-minute Consultation`.
- Current version is static. Backend/email/database integration comes later.

## Important code structure

- Global Header and Footer must remain shared so one edit updates every page.
- Each page section should live in its own folder with its own `.jsx` and `.module.css` file.
- Reusable UI belongs in `src/components/ui`.
- Do not merge all sections into one giant file.
- Do not introduce Tailwind.
- Preserve global tokens so changing H1/H2/body sizes globally changes them site-wide.

## Development rule

Before changing anything major, inspect the existing code and reuse patterns/components. Keep the project runnable with:

```bash
npm install
npm run dev
```
