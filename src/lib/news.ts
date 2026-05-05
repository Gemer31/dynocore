import Parser from 'rss-parser';
import { fallbackNews, newsSources, relevanceKeywords, type NewsItem } from '../data/newsSources';
import { stripHtml } from './seo';

const parser = new Parser({
  timeout: 6000,
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail']
    ]
  }
});

type NewsText = Pick<NewsItem, 'title' | 'excerpt'>;

const knownRussianTexts: Record<string, NewsText> = {
  'https://viezu.com/blog/best-vehicle-tuning-tool-for-cloning/': {
    title: 'Лучший инструмент для клонирования автомобильных блоков управления',
    excerpt:
      'Материал о возможностях Magic Motorsport FLEX: клонирование блоков, работа с прошивками и частые вопросы по инструменту.'
  },
  'https://viezu.com/blog/dimsport-thegenius-joins-the-viezu-tuning-tool-range/': {
    title: 'Dimsport TheGenius вошел в линейку инструментов VIEZU',
    excerpt:
      'Обзор диагностического и тюнингового оборудования TheGenius, которое расширяет варианты работы для мастерских и настройщиков.'
  },
  'https://viezu.com/blog/magic-motorsport-flex-faqs/': {
    title: 'Частые вопросы о Magic Motorsport FLEX',
    excerpt:
      'Ответы на популярные вопросы о функциях FLEX, сценариях применения и работе с инструментом при настройке автомобилей.'
  },
  'https://viezu.com/blog/viezu-technical-academy-live-qa-tools-support-and-training-for-tuners/': {
    title: 'Вопросы и ответы VIEZU Technical Academy: инструменты, WinOLS и обучение',
    excerpt:
      'Сессия VIEZU Technical Academy о выборе инструментов, поддержке настройщиков, обучении и развитии навыков работы с WinOLS.'
  }
};

const topicTexts: Array<{ keywords: string[]; text: NewsText }> = [
  {
    keywords: ['flex', 'magic motorsport', 'cloning'],
    text: {
      title: 'Инструменты для работы с ЭБУ и клонирования блоков',
      excerpt:
        'Материал источника о тюнинговом оборудовании, работе с прошивками и возможностях современных инструментов для мастерских.'
    }
  },
  {
    keywords: ['winols', 'academy', 'training', 'support'],
    text: {
      title: 'Обучение настройщиков и работа с профессиональными инструментами',
      excerpt:
        'Публикация о подготовке специалистов, поддержке тюнеров и практической работе с программами для калибровки.'
    }
  },
  {
    keywords: ['turbo', 'performance', 'software', 'remap', 'ecu', 'tuning'],
    text: {
      title: 'Новости о настройке ЭБУ и приросте мощности',
      excerpt:
        'Материал профильного источника о чип-тюнинге, программной калибровке и подходах к надежному увеличению отдачи двигателя.'
    }
  }
];

const hasCyrillic = (value: string) => /[А-Яа-яЁё]/.test(value);
const hasLatin = (value: string) => /[A-Za-z]/.test(value);

const localizeNewsText = (item: NewsItem): NewsItem => {
  const knownText = knownRussianTexts[item.url];
  if (knownText) return { ...item, ...knownText };

  const combinedText = `${item.title} ${item.excerpt}`;
  if (hasCyrillic(combinedText) || !hasLatin(combinedText)) return item;

  const haystack = combinedText.toLowerCase();
  const topicText = topicTexts.find(({ keywords }) => keywords.some((keyword) => haystack.includes(keyword)));

  return {
    ...item,
    ...(topicText?.text ?? {
      title: 'Новости автомобильного тюнинга',
      excerpt:
        'Материал профильного источника о доработке автомобилей, настройке силовых агрегатов и актуальных тенденциях рынка.'
    })
  };
};

const isRelevant = (item: NewsItem) => {
  const haystack = `${item.title} ${item.excerpt}`.toLowerCase();
  return relevanceKeywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
};

const normalizeDate = (value?: string) => {
  const parsed = value ? new Date(value) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

const getImage = (item: Record<string, unknown>) => {
  const enclosure = item.enclosure as { url?: string } | undefined;
  const mediaContent = item.mediaContent as { $?: { url?: string }; url?: string } | undefined;
  const mediaThumbnail = item.mediaThumbnail as { $?: { url?: string }; url?: string } | undefined;

  return enclosure?.url ?? mediaContent?.$?.url ?? mediaContent?.url ?? mediaThumbnail?.$?.url ?? mediaThumbnail?.url;
};

export const getLatestNews = async (limit = 6): Promise<NewsItem[]> => {
  const collected: NewsItem[] = [];

  await Promise.allSettled(
    newsSources.map(async (source) => {
      const feed = await parser.parseURL(source.url);

      for (const entry of feed.items.slice(0, 8)) {
        const link = entry.link ?? entry.guid;
        if (!entry.title || !link) continue;

        collected.push({
          title: stripHtml(entry.title),
          url: link,
          source: source.name,
          date: normalizeDate(entry.isoDate ?? entry.pubDate),
          excerpt: stripHtml(entry.contentSnippet ?? entry.content ?? entry.summary ?? '').slice(0, 220),
          image: getImage(entry as unknown as Record<string, unknown>) ?? '/news-fallback.svg'
        });
      }
    })
  );

  const deduped = new Map<string, NewsItem>();
  for (const item of collected.filter(isRelevant)) {
    deduped.set(item.url, item);
  }

  const news = [...deduped.values()]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (news.length > 0 ? news : fallbackNews.slice(0, limit)).map(localizeNewsText);
};
