export type NewsSource = {
  name: string;
  url: string;
};

export type NewsItem = {
  title: string;
  url: string;
  source: string;
  date: string;
  excerpt: string;
  image?: string;
};

export const newsSources: NewsSource[] = [
  { name: 'tuningblog.eu', url: 'https://www.tuningblog.eu/feed/' },
  { name: 'Viezu', url: 'https://viezu.com/feed/' },
  { name: 'Fast Car', url: 'https://fastcar.co.uk/tuning/feed/' },
  { name: 'Motor1', url: 'https://motor1.com/rss/category/aftermaket-tuning/' },
  { name: 'autoevolution', url: 'https://www.autoevolution.com/rss/backend-tuning.xml' },
  { name: 'Auto Onliner', url: 'https://auto.onliner.by/?feed=rss2' }
];

export const relevanceKeywords = [
  'ECU',
  'remap',
  'tuning',
  'chip tuning',
  'diesel',
  'DPF',
  'EGR',
  'AdBlue',
  'performance',
  'software',
  'прошивка',
  'тюнинг',
  'двигатель',
  'рынок авто'
];

export const fallbackNews: NewsItem[] = [
  {
    title: 'Почему диагностика важна перед настройкой ЭБУ',
    url: 'https://viezu.com/feed/',
    source: 'Viezu',
    date: '2026-04-15',
    excerpt:
      'Профильные источники все чаще подчеркивают роль диагностики и безопасной калибровки перед чип-тюнингом.',
    image: '/news-fallback.svg'
  },
  {
    title: 'Тренды доработки современных турбомоторов',
    url: 'https://www.tuningblog.eu/feed/',
    source: 'tuningblog.eu',
    date: '2026-04-10',
    excerpt:
      'В отрасли обсуждают настройку турбированных двигателей, программную калибровку и сопутствующие аппаратные доработки.',
    image: '/news-fallback.svg'
  },
  {
    title: 'Производительное ПО и надежность дорожных автомобилей',
    url: 'https://fastcar.co.uk/tuning/feed/',
    source: 'Fast Car',
    date: '2026-04-02',
    excerpt:
      'Материалы о тюнинге часто связывают надежный прирост мощности с обслуживанием, состоянием узлов и качественной настройкой.',
    image: '/news-fallback.svg'
  }
];
