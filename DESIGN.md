# Design system — rationale

CampusTracker's visual identity is built around one idea: **a notebook's
margin** — the narrow strip where a student jots a tab, a highlight, a
quick annotation. It's a deliberate alternative to the generic "dark SaaS
with a gradient blob" look, while still sitting comfortably next to
Notion, Linear, and Vercel's dashboard, which is where the visual
inspiration was drawn from.

## Palette

| Token         | Dark            | Light           | Purpose                                    |
| ------------- | --------------- | --------------- | ------------------------------------------- |
| `background`  | `#0B0E14`       | `#F7F5F0`       | Charcoal-navy at night, warm paper by day    |
| `surface`      | `#131720`       | `#FFFFFF`       | Cards, panels                                |
| `border`       | `#232838`       | `#E5E1D8`       | Hairlines                                    |
| `primary`      | periwinkle-blue | ink-blue        | Primary actions — reads like ballpoint ink   |
| `accent`       | marigold        | darker marigold | Highlights, the margin-tab motif, emphasis   |
| `success`      | green           | green           | Confirmations                                |
| `destructive`  | red             | red             | Destructive actions, errors                  |

The **accent marigold** is the signature color — it's used sparingly, the
way a student uses a highlighter: to call out one number, one tab, one
badge, never to flood a whole surface.

## Typography

- **Fraunces** (display serif) for headlines and card titles — it has
  enough personality to feel human and editorial rather than corporate,
  without sacrificing legibility at large sizes.
- **Inter** (sans) for body copy, labels, and UI chrome — a neutral,
  highly legible workhorse.
- **JetBrains Mono** for anything tabular or precise: roll numbers, times,
  countdown figures.

## The "margin tab" motif

`globals.css` defines a `.margin-tab` utility: a thin accent-colored rule
along the left edge of a block, used on:

- Dashboard widget headers
- The hero's mock dashboard stats
- Section eyebrows on the landing page

It's the one recurring visual signature that ties the marketing site to
the authenticated app, so the transition from "landing page" to "logged
in" doesn't feel like two different products.

## Motion

Framer Motion is used for entrance animation only (fade/slide-up on
scroll, a staggered widget grid) — nothing loops, nothing distracts from
reading. `prefers-reduced-motion` is respected by keeping all animations
short (300–700ms) and non-essential to comprehension.

## Changing the theme

Everything is centralized:

1. **Colors** — CSS variables in `src/app/globals.css` (`:root` for light,
   `.dark` for dark).
2. **Semantic names** — `tailwind.config.ts` maps those variables to
   Tailwind color utilities (`bg-accent`, `text-muted-foreground`, etc.),
   so components never reference raw hex values.
3. **Fonts** — `src/app/layout.tsx` loads them via `next/font/google` and
   exposes them as CSS variables consumed by `tailwind.config.ts`.
