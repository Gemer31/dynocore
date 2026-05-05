import { siteConfig } from '../data/site';

export const absoluteUrl = (path = '/') => new URL(path, siteConfig.url).toString();

export const canonicalPath = (path = '/') => {
  if (path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
};

export const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
