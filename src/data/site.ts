export const siteConfig = {
  name: 'DynoCore',
  slogan: 'Точная настройка мощности. Без лишнего риска.',
  description:
    'Чип-тюнинг, диагностика и инженерная калибровка ЭБУ в Беларуси с резервной копией заводской программы.',
  url: import.meta.env.SITE_URL ?? 'https://dynocore.by',
  locale: 'ru_BY',
  phone: '+375 29 000-00-00',
  email: 'hello@dynocore.by',
  address: 'Минск, адрес сервиса уточняется',
  workingHours: 'Пн-Сб 09:00-19:00',
  messengers: {
    telegram: 'https://t.me/dynocore',
    viber: 'viber://chat?number=%2B375290000000',
    whatsapp: 'https://wa.me/375290000000',
    instagram: 'https://www.instagram.com/dynocore.by/'
  }
};

export const mainNav = [
  { href: '/chip-tyuning/', label: 'Чип-тюнинг' },
  { href: '/diagnostika-egr/', label: 'Удаление экологии' },
  { href: '/ceny/', label: 'Цены' },
  { href: '/raboty/', label: 'Работы' },
  { href: '/blog/', label: 'Блог' },
  { href: '/kontakty/', label: 'Контакты' }
];

export const footerNav = [
  { href: '/chip-tyuning-dizel/', label: 'Дизель' },
  { href: '/chip-tyuning-benzin/', label: 'Бензин' },
  { href: '/problemy-dpf-fap/', label: 'DPF/FAP' },
  { href: '/diagnostika-adblue-scr/', label: 'AdBlue/SCR' },
];
