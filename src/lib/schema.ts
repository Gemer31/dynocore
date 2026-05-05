import type { FaqItem } from '../data/services';
import { siteConfig } from '../data/site';
import { absoluteUrl } from './seo';

export type JsonLd = Record<string, unknown>;

export const organizationSchema = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  slogan: siteConfig.slogan,
  email: siteConfig.email,
  telephone: siteConfig.phone
});

export const websiteSchema = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: 'ru-BY',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
});

export const automotiveBusinessSchema = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: siteConfig.name,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Минск',
    addressCountry: 'BY',
    streetAddress: siteConfig.address
  },
  areaServed: ['Минск', 'Республика Беларусь'],
  openingHours: 'Mo-Sa 09:00-19:00'
});

export const serviceSchema = (name: string, description: string, path: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  areaServed: {
    '@type': 'Country',
    name: 'Belarus'
  },
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url
  },
  url: absoluteUrl(path)
});

export const faqSchema = (faq: FaqItem[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
});

export const breadcrumbSchema = (items: Array<{ name: string; path: string }>): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path)
  }))
});
