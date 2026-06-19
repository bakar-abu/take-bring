# Take & Bring

Next.js scaffold for [Take & Bring](https://take-bring.eu/). **No UI design included** — ready for HTML/CSS conversion.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- next-intl (DE / EN / RO)

## Commands

```bash
npm install
npm run dev
```

## Where to paste HTML

| Area | File |
|------|------|
| Header | `src/components/layout/header.tsx` |
| Footer | `src/components/layout/footer.tsx` |
| Home | `src/app/[locale]/page.tsx` |
| Kuriertransporte | `src/app/[locale]/kuriertransporte/page.tsx` |
| Spedition LKW | `src/app/[locale]/spedition-lkw/page.tsx` |
| Kühltransporte | `src/app/[locale]/kuehltransporte/page.tsx` |
| Tracking | `src/app/[locale]/tracking/page.tsx` |
| Kontakt | `src/app/[locale]/kontakt/page.tsx` |
| Über uns | `src/app/[locale]/ueber-uns/page.tsx` |

Page-specific components go in `src/components/{page-name}/`.

Reusable UI primitives (button, input, etc.) go in `src/components/ui/`.

## Structure

```
src/
├── app/[locale]/          # Routes + empty page shells
├── assets/styles/         # globals.css (Tailwind + max-width 1440px)
├── components/
│   ├── ui/                # Unstyled reusable primitives
│   ├── layout/            # Header, Footer, LanguageSwitcher
│   ├── shared/            # JsonLd
│   └── {page-name}/       # Page-specific components
├── config/                # site.ts, theme.ts
├── lib/i18n/              # Routing & navigation
├── lib/seo/               # Metadata & JSON-LD helpers
└── messages/              # SEO strings only (de, en, ro)
```

## Locales

- `/` — Romanian (default)
- `/en` — English
- `/de` — German

## SEO

Set `INDEXING_ENABLED=false` in `.env.local` for staging; `true` (or omit) for production. See `.env.example`.
