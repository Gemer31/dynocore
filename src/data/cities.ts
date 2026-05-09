import type { FaqItem } from './services';

export type CityPage = {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  areas: string[];
  faq: FaqItem[];
};

export const cityPages: CityPage[] = [
  {
    slug: 'minsk',
    name: 'Минск',
    title: 'Чип-тюнинг в Минске | DynoCore',
    description:
      'Чип-тюнинг и диагностика ЭБУ в Минске: дизель, бензин и решения по EGR, DPF/FAP, AdBlue/SCR после проверки автомобиля.',
    h1: 'Чип-тюнинг в Минске с расчетом прироста и диагностикой',
    intro:
      'DynoCore принимает заявки по Минску и Беларуси. Перед записью уточняем марку, двигатель, цель обращения и ориентируем по цене и ожидаемому результату.',
    areas: ['Минск', 'Минская область', 'по согласованию - автомобили из регионов Беларуси'],
    faq: [
      {
        question: 'Можно ли получить расчет до визита?',
        answer:
          'Да. Отправьте марку, модель, двигатель, год и цель обращения. Мы дадим ориентир по цене и ожидаемому диапазону результата.'
      },
      {
        question: 'Нужно ли оставлять автомобиль на день?',
        answer:
          'Зависит от задачи и диагностики. Стандартная настройка ЭБУ обычно планируется быстрее, сложные ошибки EGR/DPF/SCR требуют больше времени.'
      }
    ]
  }
];

export const getCityPage = (slug: string) => cityPages.find((city) => city.slug === slug);
