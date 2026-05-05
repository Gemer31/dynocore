import type { APIRoute } from 'astro';
import { siteConfig } from '../data/site';

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${siteConfig.url}/sitemap-index.xml
`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    }
  );
