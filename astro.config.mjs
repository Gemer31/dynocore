import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL ?? 'https://dynocore.by';

export default defineConfig({
  site,
  redirects: {
    '/stage-1': '/chip-tyuning',
    '/stage-2': '/chip-tyuning'
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    react(),
    sitemap()
  ],
  output: 'static',
  adapter: node({ mode: 'standalone' })
});
