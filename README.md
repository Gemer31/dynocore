# DynoCore Website

Astro + TypeScript + Tailwind lead-generation site for DynoCore chip-tuning services in Belarus. The site pre-renders content pages and uses the Astro Node adapter for the live `/api/lead` POST endpoint.

## Commands

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Structure

- `src/data/` contains service, brand, city, price, news source and site config.
- `src/pages/[slug].astro`, `src/pages/marki/[brand].astro` and `src/pages/goroda/[city].astro` generate data-driven landing pages.
- `src/content/blog/` contains MDX expert articles.
- `src/components/forms/LeadForm.tsx` handles client validation, UTM capture, consent and form states.
- `src/pages/api/lead.ts` validates submissions and posts to an optional webhook or logs a safe simulation.

## Environment

Copy `.env.example` to `.env` when needed.

- `SITE_URL` - canonical site URL, defaults to `https://dynocore.by`.
- `LEAD_WEBHOOK_URL` - optional server-side lead webhook. If empty, `/api/lead` validates and logs a safe simulated submission.
- `PUBLIC_GA4_ID` - optional GA4 ID.
- `PUBLIC_GTM_ID` - optional Google Tag Manager ID.
- `PUBLIC_YANDEX_METRIKA_ID` - optional Yandex Metrika counter ID.

## Implementation Notes

- RSS news are source-linked previews only. They are not copied as indexable article pages.
- Reviews, ratings and case results are intentionally omitted until real verified data exists.
- EGR/DPF/AdBlue copy is framed around diagnostics and compliant solutions after inspection, without promises about inspection results or illegal removal.
- The default production build targets Node standalone output. Swap the adapter if deploying to Vercel, Netlify or Cloudflare Pages Functions.
- Lighthouse on local preview: Performance 85, Accessibility 96, Best Practices 96, SEO 100.
